import { Brackets, FindManyOptions, FindOneOptions, FindOptionsRelations, In, Raw, Repository, SelectQueryBuilder, WhereExpressionBuilder } from "typeorm";
import { FilterOption } from "../models/filter-option.model";
import { TypeFilter } from "../constants/type-filter.enum";
// import * as moment from "moment";
import { plainToInstance } from "class-transformer";

export const addFilterToRequest = <T,U>(filterDto: T, options: FindManyOptions<U> | FindOneOptions<U>, relationsFields?: any): FindManyOptions<U> | FindOneOptions<U> =>{
    if (relationsFields) {
        for (const key in relationsFields) {
            const filter = filterDto[key];
            if (filter) {
                const relationKey = relationsFields[key];

                /* if (relationsFields[key] instanceof Object) {
                    
                }else if (relationsFields[key] instanceof Array){

                }else{ */
                    options.where[key] = {
                        [relationKey]: filter instanceof Array ? In(filter) : filter
                    };
                // }
                delete filterDto[key];
            }
        }
    }
    Object.keys(filterDto).forEach(key => {
        if (['page','size'].findIndex(k => k == key) == -1) {
            switch (filterDto[key].constructor) {
                case String:
                    options.where[key] = Raw((alias) =>`LOWER(${alias}) LIKE '%${filterDto[key].toLowerCase()}%'`);
                    break;
                case Array:
                    options.where[key] = In(filterDto[key]);
                    break;
                default:
                    options.where[key] = filterDto[key];
                    break;
            }
        }
    });
    return options;
};

export const addFilterToQueryBuiler = <T,U>(
    alias: string,
    filterDto: T,
    repo: Repository<U>,
    relationsFields?: string[],
): SelectQueryBuilder<U>=>{
    let whereAdded:boolean = false;
    let options = repo.createQueryBuilder(alias);

    let filterFields: FilterOption[] = filterDto ? filterDto['filter_options'] : [];

    const brFields = filterFields.filter(f => f.type == 'bracket' || f.type == 'not_bracket');

    brFields.forEach(brf => {
        const f_ind = filterFields.findIndex(f1 => f1.name == brf.name);
        let rfbr = brf.bracket_fields;
        const brf_to_add: FilterOption[] = [];
        rfbr.forEach((rf, ind) => {
            if (rf.relations && rf.relations.length > 0) {
                rf.relations.forEach((rfr, ind2) => {
                    const rf_copy = {...rf};
                    delete rf_copy.relations;
                    if (ind2 == 0) delete rf_copy.operator;
                    rf_copy.relation = rfr;
                    brf_to_add.push(rf_copy);
                });
                rfbr.splice(ind, 1);
            }
        });
        rfbr = rfbr.concat(brf_to_add);
        brf.bracket_fields = rfbr;
        filterFields[f_ind] = brf;
    });

    let allBRelations = [];
    filterFields.filter(f => f.type == 'bracket' || f.type == 'not_bracket').forEach(ab => {
        allBRelations = allBRelations.concat(ab.bracket_fields.filter(abb => abb.is_relation == true));
    });

    let rFields = filterFields.filter(f => f.is_relation == true).concat(allBRelations).map(f => f.relation.alias.replaceAll('_','.'));
    rFields = rFields.filter(f => !relationsFields.find(rf => rf == f));

    Object.keys(filterDto).forEach(key => {
        if (['page','size','filter_options'].findIndex(k => k == key) == -1) {
            const findKey = filterFields.filter(f => f.is_relation == true).concat(allBRelations).filter(rf => rf.name == key);
            if(findKey.length > 0 && filterDto[key]){
                findKey.forEach(fk => {
                    const transfAlias = fk.relation.alias.replaceAll('_','.');
                    if(rFields.find(rf => rf == transfAlias)) relationsFields.push(transfAlias);
                })
            }
        }
    });

    // relationsFields = relationsFields.concat(rFields);

    const relationsJoined: string[] = [];
    let notSelect: boolean = false;

    for (const rf of relationsFields) {
        if (rFields.find(rrf => rrf == rf)) notSelect = true;
        if (rf.split('.').length > 1) {
            let nalias = alias;
            rf.split('.').forEach((rff, i)=>{
                const naliasName = (i > 0) ? `${nalias}_${rff}` : rff;
                if (!relationsJoined.find(rj => rj == naliasName)){
                    relationsJoined.push(naliasName);
                    // const ffr = filterFields.find(f => f.relation?.name === rff);
                    // options = options.leftJoinAndSelect(`${nalias}.${rff}`, ffr ? ffr.relation.alias : `${nalias}_${rff}`);
                    // nalias = ffr ? ffr.relation.alias : `${nalias}_${rff}`;
                    /* console.log(`${nalias}.${rff}`);
                    console.log(`${naliasName}`); */
                    options = notSelect ? options.leftJoin(`${nalias}.${rff}`, `${naliasName}`) : options.leftJoinAndSelect(`${nalias}.${rff}`, `${naliasName}`);
                }
                nalias = (i > 0) ? `${nalias}_${rff}` : rff;
            });
        }else{
            if (!relationsJoined.find(rj => rj == rf)){
                relationsJoined.push(rf);
                // const ffr = filterFields.find(f => f.relation?.name === rf);
                // options = options.leftJoinAndSelect(`${alias}.${rf}`, ffr ? ffr.relation.alias : rf);
                options = notSelect ? options.leftJoin(`${alias}.${rf}`, rf) : options.leftJoinAndSelect(`${alias}.${rf}`, rf);
            }
        }
    }

    if (filterDto && filterDto.constructor == Object) {
        Object.keys(filterDto).forEach(key => {
            if (['page','size','filter_options'].findIndex(k => k == key) == -1) {
                const foption = filterFields.find(f => f.name === key && f.type == "field");
                if (foption && filterDto[key]) {
                    options = formatOption(alias, whereAdded, foption, filterDto, options) as SelectQueryBuilder<U>;
                }else{
                    const fbrackets = filterFields.filter(f => f.type == "bracket" || f.type == "not_bracket");

                    fbrackets.forEach(fb => {
                        if (fb.bracket_fields?.length > 0) {
                            let stopIt: boolean = true;
                            fb.bracket_fields?.forEach(fbf => {
                                if (filterDto[fbf.name]) stopIt = false;
                            });
                            if (fb.type == "bracket" && !stopIt) {
                                if (whereAdded) {
                                    switch (fb.operator) {
                                        case "or":
                                            options = options.orWhere(new Brackets(qb => qb = formatBracketOption(alias, fb, filterDto, qb)));
                                            break;
                                        case "and":
                                            options = options.andWhere(new Brackets(qb => qb = formatBracketOption(alias, fb, filterDto, qb)));
                                            break;
                                    }
                                }else{
                                    options = options.where(new Brackets(qb => qb = formatBracketOption(alias, fb, filterDto, qb)));
                                }
                            }
                        }
                    });
                }
                whereAdded = true;
            }
        });
    }
    relationsFields = [];
    return options;
};

const formatOption = <T,U>(alias: string, whereAdded: boolean, foption: FilterOption, filterDto: T, options: SelectQueryBuilder<U> | WhereExpressionBuilder) => {
    const formatedQuery = formatQuery(alias, foption, filterDto);
    if (whereAdded) {
        options = formatOperator(formatedQuery, foption, options);
    } else {
        options = options.where(formatedQuery.whereText, {[formatedQuery.fkey]: formatedQuery.returnValue});
    }
    return options;
}

const formatBracketOption = <T>(alias: string, foption: FilterOption, filterDto: T, options: WhereExpressionBuilder) => {
    let whereAddedBracket: boolean = false;
    foption.bracket_fields?.forEach(fbf => {
        if (filterDto[fbf.name]) {
            options = formatOption(alias, whereAddedBracket, fbf, filterDto, options);
            whereAddedBracket = true;
        }
    });
    return options;
}

export const checkStringOrArray = <T>(
    fields: string[],
    filterDto: T
): T =>{
    fields.forEach(f => {
        if (filterDto[f] && filterDto[f].constructor == String) {
            filterDto[f] =  [filterDto[f]];
        }
    });
    return filterDto;
};

const formatQuery = <T>(alias: string, fopt: FilterOption, filterDto: T) => {
    let whereText = '';
    const filterValue = filterDto[fopt.name];
    let returnValue = filterValue;
    const fkey = fopt.is_relation ? fopt.relation.alias+fopt.name : fopt.name;
    const falias = fopt.is_relation ? fopt.relation.alias : alias;

    if (fopt.lowercase)
        whereText = `LOWER(`;

    if (fopt.concat_fields.length > 0){
        fopt.concat_fields.forEach((cf,i) => fopt.concat_fields[i] = `${falias}.${cf}`);
        whereText += `CONCAT(${fopt.concat_fields.join(", ' ', ")})`;
    }else{
        whereText += `${falias}.${fopt.field_name}`;
    }
    
    whereText += fopt.lowercase ? ') ' : ' ';
    whereText += `${TypeFilter[fopt.type_filter]} `;

    switch (filterValue.constructor) {
        case Array:
            whereText += `(:...${fkey})`;
            break;
        default:
            const likeTypes: string[] = ["like", "nlike"];
            if (fopt.lowercase)
                returnValue = returnValue.toLowerCase();
            if (likeTypes.findIndex(lt => lt == fopt.type_filter) > -1)
                returnValue = `%${returnValue}%`;
            /* if (fopt.type_filter === "start_date" && fopt.type_date === "datetime")
                returnValue = moment(returnValue).toISOString();
            if (fopt.type_filter === "end_date" && fopt.type_date === "datetime")
                returnValue = moment(returnValue).add(23,"hours").add(59,"minutes").toISOString(); */
                
            whereText += `:${fkey}`;
            break;
    }

    return { fkey, whereText, returnValue};
}

const formatOperator = <U>(formatedQuery: any, fopt: FilterOption, options: SelectQueryBuilder<U> | WhereExpressionBuilder): SelectQueryBuilder<U>  | WhereExpressionBuilder => {
    switch (fopt.operator) {
        case "or":
            options = options.orWhere(formatedQuery.whereText, {[formatedQuery.fkey]: formatedQuery.returnValue});
            break;
        case "and":
            options = options.andWhere(formatedQuery.whereText, {[formatedQuery.fkey]: formatedQuery.returnValue});
            break;
        case "hav":
            options = (options as SelectQueryBuilder<U>).andHaving(formatedQuery.whereText, {[formatedQuery.fkey]: formatedQuery.returnValue});
            break;
        case "or_hav":
            options = (options as SelectQueryBuilder<U>).orHaving(formatedQuery.whereText, {[formatedQuery.fkey]: formatedQuery.returnValue});
            break;
    }
    return options;
}

const dictionary: string[] = [].concat(
    ("abcdefghijklmnopqrstuvwxyz").split(""),
    ("ABCDEFGHIJKLMNOPWRSTUVWXYZ").split(""),
    ("0123456789").split(""),
    ("!@#$%^&*-_=+\\|:;',.\<>/?~").split("")
);

export const generatePassword = (length: number) => {
    let newPassword = "";
    for (var i = 0; i < length; i++) {
      newPassword += dictionary[Math.floor(Math.random() * dictionary.length)];
    }
    return newPassword;
}

  
export const assignRelations = <T,D>(entity: T, relationFields: string[], relations: any[], entityToFill?: D) => {
    relationFields.forEach((r, i) => {
    	if(entity[r]){
			if (entity[r].constructor === Array) {
				entity[r] = entity[r].map(er => plainToInstance(relations[i], {id: er}));
			}else{
				entity[r] = plainToInstance(relations[i], {id: entity[r]});
			}
            if (entityToFill) entityToFill[r] = entity[r] as any;
		}
        
    });
    return entityToFill ?? entity;
}
  
export const assignNullToUndefined = <T>(entity: T, fileFields: string[] = []) => {
    for (const key in entity) {
        if (!fileFields.find(f => f == key)){
            if(entity[key] == undefined || entity[key] == '') entity[key] = null;
        }else{
            if(entity[key] == undefined || entity[key] == '') delete entity[key];
        }
    }
    return entity;
}

export const extractTokenSign = (token: string): string => {
    const [head, payload, sign] = token.split('.') ?? [];
    return sign;
}
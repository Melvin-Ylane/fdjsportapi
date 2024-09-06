export class FilterOption {
    type?: "field" | "bracket" | "not_bracket";
    name: string;
    field_name?: string;
    alias?: string;
    concat_fields?: string[];
    bracket_fields?: FilterOption[];
    operator?: "or" | "and" | "hav" | "or_hav";
    type_filter: "eq" | "diff" | "like" | "in" | "nlike" | "not_in" | "gt" | "lt" |"gte" | "lte" | "start_date" | "end_date";
    type_date?: "date" | "datetime";
    is_relation?: boolean = false;
    lowercase?: boolean = false;
    relation?: {
        name: string,
        alias: string
    };
    relations?: {
        name: string,
        alias: string
    }[];
    
    constructor({type = "field", name, field_name, alias, concat_fields = [], bracket_fields = [], operator = "and", type_filter="like", type_date="datetime", is_relation = false, lowercase = false, relation, relations = []}: {
        type?: "field" | "bracket" | "not_bracket",
        name: string,
        field_name?: string,
        alias?: string,
        concat_fields?: string[],
        bracket_fields?: FilterOption[],
        operator?: "or" | "and" | "hav" | "or_hav",
        type_filter?: "eq" | "diff" | "like" | "in" | "nlike" | "not_in" | "gt" | "lt" | "gte" | "lte" | "start_date" | "end_date",
        type_date?: "date" | "datetime",
        is_relation?: boolean,
        lowercase?: boolean,
        relation?: {
            name: string,
            alias: string
        },
        relations?: {
            name: string,
            alias: string
        }[]
    }) {
        this.type = type;
        this.name = name;
        this.field_name = field_name ?? this.name;
        this.alias = alias;
        this.concat_fields = concat_fields;
        this.bracket_fields = bracket_fields;
        this.operator = operator;
        this.type_filter = type_filter;
        this.type_date = type_date;
        this.is_relation = is_relation;
        this.lowercase = lowercase;
        this.relation = relation;
        this.relations = relations;
    }
}

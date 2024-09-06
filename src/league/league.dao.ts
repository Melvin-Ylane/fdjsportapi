import { FilterLeagueDto } from './dto/filter-league.dto';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { League, LeagueSchemaName } from "./schemas/league.shema";

export class LeagueDao {
    
    constructor(
        @InjectModel(LeagueSchemaName) private leagueModel: Model<League>
    ){}

    getLeagues(filterLeague: FilterLeagueDto) {
        let filters: any = {};
        if (filterLeague.name) filters.name = { $regex : new RegExp(filterLeague.name, "i") };

        let options = this.leagueModel.find(filters);
        let total = this.leagueModel.countDocuments(filters).exec();
        if (filterLeague.page && filterLeague.size) {
            const offset = (filterLeague.page - 1) * filterLeague.size;
            options = options.skip(offset).limit(filterLeague.size);
        }
        return Promise.all([options.lean(), total]);
    }

    findOne(id: string) {
        return this.leagueModel.findById(id).populate('teams').orFail();
    }
}
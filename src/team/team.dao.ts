import { FilterTeamDto } from './dto/filter-team.dto';
import { Team } from "./schemas/team.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { PlayerSchemaName } from "src/player/schemas/player.schema";

export class TeamDao {

    relationsFields: string[] = [];
    
    constructor(
        @InjectModel('teams') private teamModel: Model<Team>
    ){}

    getTeams(filterTeam: FilterTeamDto) {
        let options = this.teamModel.find();
        let total = this.teamModel.countDocuments().exec();
        if (filterTeam.page && filterTeam.size) {
            const offset = (filterTeam.page - 1) * filterTeam.size;
            options = options.skip(offset).limit(filterTeam.size);
        }
        return Promise.all([options.lean(), total]);
    }

    findOne(id: string) {
        return this.teamModel.findById(id).populate(PlayerSchemaName).orFail();
    }
}
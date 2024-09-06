import { FilterPlayerDto } from './dto/filter-player.dto';
import { Player, PlayerSchemaName } from "./schemas/player.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export class PlayerDao {

    relationsFields: string[] = [];
    
    constructor(
        @InjectModel(PlayerSchemaName) private playerModel: Model<Player>
    ){}

    getPlayers(filterPlayer: FilterPlayerDto) {
        let options = this.playerModel.find();
        let total = this.playerModel.countDocuments().exec();
        if (filterPlayer.page && filterPlayer.size) {
            const offset = (filterPlayer.page - 1) * filterPlayer.size;
            options = options.skip(offset).limit(filterPlayer.size);
        }
        return Promise.all([options.lean(), total]);
    }

    findOne(id: string) {
        return this.playerModel.findById(id).orFail();
    }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/models/pagination.model';
import { instanceToInstance, plainToInstance } from 'class-transformer';
import { FilterPlayerDto } from './dto/filter-player.dto';
import { PlayerDao } from './player.dao';
import { Player } from './schemas/player.schema';

@Injectable()
export class PlayerService {
  
  constructor(
    private dao: PlayerDao
  ){}

  findAll(filterPlayer: FilterPlayerDto): Promise<Pagination<Player>> {
    return this.dao.getPlayers(filterPlayer).then((results) => {
      const pagination: Pagination<Player> = {
        totalRows: results[1],
        datas: instanceToInstance(results[0])
      };
      return pagination;
    });
  }

  async findOne(id: string): Promise<Player> {
    return this.dao.findOne(id).catch(() => {
      throw new NotFoundException('Player not found');
    });
  }
}
  
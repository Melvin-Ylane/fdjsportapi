import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/models/pagination.model';
import { instanceToInstance } from 'class-transformer';
import { FilterLeagueDto } from './dto/filter-league.dto';
import { LeagueDao } from './league.dao';
import { League } from './schemas/league.shema';

@Injectable()
export class LeagueService {
  
  constructor(
    private dao: LeagueDao
  ){}

  findAll(filterLeague: FilterLeagueDto): Promise<Pagination<League>> {
    return this.dao.getLeagues(filterLeague).then((results) => {
      const pagination: Pagination<League> = {
        totalRows: results[1],
        datas: instanceToInstance(results[0])
      };
      return pagination;
    });
  }

  async findOne(id: string): Promise<League> {
    return this.dao.findOne(id).catch(() => {
      throw new NotFoundException( 'League not found');
    });
  }
  

}
  
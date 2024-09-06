import { Injectable, NotFoundException } from '@nestjs/common';
import { Pagination } from 'src/shared/models/pagination.model';
import { instanceToInstance } from 'class-transformer';
import { FilterTeamDto } from './dto/filter-team.dto';
import { TeamDao } from './team.dao';
import { Team } from './schemas/team.schema';

@Injectable()
export class TeamService {
  
  constructor(
    private dao: TeamDao
  ){}

  findAll(filterTeam: FilterTeamDto): Promise<Pagination<Team>> {
    return this.dao.getTeams(filterTeam).then((results) => {
      const pagination: Pagination<Team> = {
        totalRows: results[1],
        datas: instanceToInstance(results[0])
      };
      return pagination;
    }).catch((err) => {
      throw new NotFoundException('Team not found');
    });
  }

  async findOne(id: string): Promise<Team> {
    return this.dao.findOne(id).catch(() => {
      throw new NotFoundException('Team not found');
    });
  }
}
  
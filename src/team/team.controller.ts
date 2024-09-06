import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import { TeamService } from './team.service';
import { FilterTeamDto } from './dto/filter-team.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response.decorator';
import { Team } from './schemas/team.schema';

@Controller('teams')
export class TeamController {

  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiPaginatedResponse(Team, 'The records has been loaded successfully.')
  @ApiResponse({ status: 500, description: 'An error occurred while loading the records.' })
  async findAll(@Query() filterTeam: FilterTeamDto) {
    return this.teamService.findAll(filterTeam);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The record has been loaded successfully.', type: Team })
  @ApiResponse({ status: 404, description: 'The record was not found.' })
  @ApiResponse({ status: 500, description: 'An error occurred while loading the record.' })
  findOne(@Param('id') id: string) {
    return this.teamService.findOne(id);
  }
}

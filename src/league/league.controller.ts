import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import { LeagueService } from './league.service';
import { FilterLeagueDto } from './dto/filter-league.dto';
import { ApiResponse } from '@nestjs/swagger';
import { League } from './schemas/league.shema';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response.decorator';

@Controller('leagues')
export class LeagueController {

  constructor(private readonly leagueService: LeagueService) {}

  @Get()
  @ApiPaginatedResponse(League, 'The records has been loaded successfully.')
  @ApiResponse({ status: 500, description: 'An error occurred while loading the records.' })
  async findAll(@Query() filterLeague: FilterLeagueDto) {
    return this.leagueService.findAll(filterLeague);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The record has been loaded successfully.', type: League })
  @ApiResponse({ status: 404, description: 'The record was not found.' })
  @ApiResponse({ status: 500, description: 'An error occurred while loading the record.' })
  findOne(@Param('id') id: string) {
    return this.leagueService.findOne(id);
  }
}

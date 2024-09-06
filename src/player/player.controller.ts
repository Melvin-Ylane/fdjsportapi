import { Controller, Get, Query, Post, Body, Put, Param, Delete, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import { FilterPlayerDto } from './dto/filter-player.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Player } from './schemas/player.schema';
import { ApiPaginatedResponse } from 'src/shared/decorators/api-paginated-response.decorator';

@Controller('players')
export class PlayerController {

  constructor(private readonly playerService: PlayerService) {}

  @Get()
  @ApiPaginatedResponse(Player, 'The records has been loaded successfully.')
  @ApiResponse({ status: 500, description: 'An error occurred while loading the records.' })
  async findAll(@Query() filterPlayer: FilterPlayerDto) {
    return this.playerService.findAll(filterPlayer);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'The record has been loaded successfully.', type: Player })
  @ApiResponse({ status: 404, description: 'The record was not found.' })
  @ApiResponse({ status: 500, description: 'An error occurred while loading the record.' })
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }
}

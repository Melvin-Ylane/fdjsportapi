import { Module } from '@nestjs/common';
import { LeagueService } from './league.service';
import { LeagueController } from './league.controller';
import { LeagueDao } from './league.dao';
import { MongooseModule } from '@nestjs/mongoose';
import { LeagueSchema, LeagueSchemaName } from './schemas/league.shema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LeagueSchemaName, schema: LeagueSchema }])
  ],
  controllers: [LeagueController],
  providers: [LeagueService, LeagueDao]
})
export class LeagueModule {}

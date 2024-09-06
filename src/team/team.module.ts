import { Module } from '@nestjs/common';
import { TeamService } from './team.service';
import { TeamController } from './team.controller';
import { TeamDao } from './team.dao';
import { TeamSchema, TeamSchemaName } from './schemas/team.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TeamSchemaName, schema: TeamSchema }])
  ],
  controllers: [TeamController],
  providers: [TeamService, TeamDao]
})
export class TeamModule {}

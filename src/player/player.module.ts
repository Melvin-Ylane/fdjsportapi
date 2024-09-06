import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { PlayerDao } from './player.dao';
import { PlayerSchema, PlayerSchemaName } from './schemas/player.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: PlayerSchemaName, schema: PlayerSchema }])
  ],
  controllers: [PlayerController],
  providers: [PlayerService, PlayerDao]
})
export class PlayerModule {}

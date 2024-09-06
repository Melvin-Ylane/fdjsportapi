import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LeagueModule } from './league/league.module';
import { ConfigModule } from '@nestjs/config';
import { envFilePath } from './shared/utils/file.utils';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath(),
      isGlobal: true
    }),
    MongooseModule.forRoot('mongodb://'+process.env.DB_HOST+':'+process.env.DB_PORT+'/'+process.env.DB_DATABASE),
    LeagueModule,
    TeamModule,
    PlayerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Team, TeamSchemaName } from 'src/team/schemas/team.schema';
import { ObjectId } from 'typeorm';

export type LeagueDocument = HydratedDocument<League>;

@Schema()
export class League {
	@ApiProperty({name: '_id'})
	id: string;
	@ApiProperty()
	@Prop({ required: true })
	name: string;
	@ApiProperty()
	@Prop({ required: true })
	sport: string;
	@ApiProperty({ type: () => [Team]})
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: TeamSchemaName }] })
	teams: Team[];
}

export const LeagueSchema = SchemaFactory.createForClass(League);
export const LeagueSchemaName = 'leagues';
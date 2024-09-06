import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { Player, PlayerSchemaName } from 'src/player/schemas/player.schema';

export type TeamDocument = HydratedDocument<Team>;

@Schema()
export class Team {
	@ApiProperty({name: '_id'})
	id: string;
	@ApiProperty()
	@Prop({ required: true })
	name: string;
	@ApiProperty()
	@Prop({ required: true })
	sport: string;
	@ApiProperty({ type: () => [Player]})
	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: PlayerSchemaName }] })
	players: Player[];
} 

export const TeamSchema = SchemaFactory.createForClass(Team);
export const TeamSchemaName = 'teams';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema()
export class Player {
	@ApiProperty({ name: '_id' })
	id: string;
	@ApiProperty()
	@Prop({ required: true })
	name: string;
	@ApiProperty()
	@Prop({ required: true })
	position: string;
	@ApiProperty()
	@Prop({ required: true })
	thumbnail: string;
	@ApiProperty({
		type: 'object',
		properties: {
			amount: {
				type: 'number',
				minimum: 1
			},
			currency: {
				type: 'string'
			}
		}
	})
	@Prop(raw({
		amount: { type: Number, min: 1 },
		currency: { type: String }
	}))
	signin: Record<number, string>;
	@ApiProperty({
		default: '1989-06-19T01:37:19.198+00:00'
	})
	@Prop()
	born: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
export const PlayerSchemaName = 'players';
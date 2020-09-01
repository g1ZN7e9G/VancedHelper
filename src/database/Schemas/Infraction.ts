import { Document, Schema, model } from 'mongoose';

export interface Infraction extends Document {
	userID: string;
	guildID: string;
	infractionType: 'MUTE' | 'SPAM';
	end: number;
}

const InfractionSchema = new Schema({
	userID: String,
	guildID: String,
	infractionType: String,
	end: Number
});

export default model<Infraction>('Infractions', InfractionSchema);

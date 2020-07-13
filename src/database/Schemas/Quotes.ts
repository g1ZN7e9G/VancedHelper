import { Document, Schema, model } from 'mongoose';

export interface Quotes extends Document {
	messageID: string;
	channelID: string;
	guildID: string;
	link: string;
	authorID: string;
	content: string;
	author: Record<'name' | 'avatar', string>;
	attachment?: string;
	timestamp: number;
	case: number;
	stars: Array<string>;
}

const QuoteSchema = new Schema({
	messageID: String,
	channelID: String,
	guildID: String,
	link: String,
	authorID: String,
	content: String,
	author: {
		name: String,
		avatar: String
	},
	attachment: String,
	timestamp: Number,
	case: Number,
	stars: Array
});

export default model<Quotes>('Quotes', QuoteSchema);

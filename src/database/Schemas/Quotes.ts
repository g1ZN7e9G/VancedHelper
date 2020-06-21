import { Document, Schema, model } from 'mongoose';

export interface Quotes extends Document {
	messageID: string;
	channelID: string;
	guildID: string;
	link: string;
	authorID: string;
	content: string;
	author: {
		name: string;
		avatar: string;
	};
	attachment?: string;
	case: number;
	stars: string[];
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
	case: Number,
	stars: Array
});

export default model<Quotes>('Quotes', QuoteSchema);

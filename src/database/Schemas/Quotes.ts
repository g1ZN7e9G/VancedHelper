import { Document, Schema, model } from 'mongoose';

export interface Quotes extends Document {
	messageID: string;
	content: string;
	author: {
		id: string;
		name: string;
		avatar: string;
	};
}

const QuoteSchema = new Schema({
	messageID: String,
	content: String,
	author: {
		id: String,
		name: String,
		avatar: String
	}
});

export default model<Quotes>('Quotes', QuoteSchema);

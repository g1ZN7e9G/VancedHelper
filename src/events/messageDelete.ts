import { Client, Message } from '../Client';

export default async (client: Client, msg: Message) => {
	// Delete quote if found
	await client.database.quotes.findOneAndDelete({ messageID: msg.id });
};

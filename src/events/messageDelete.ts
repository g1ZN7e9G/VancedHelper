import { Client, Message } from '../Client';

export default async (client: Client, msg: Message) => {
	await client.database.quotes.findOneAndDelete({ messageID: msg.id });
};

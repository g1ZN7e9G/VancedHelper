import { Client, Message } from '../Client';

export default async (client: Client, msg: Message) => {
	client.database.quotes.findOneAndDelete({ messageID: msg.id });
};

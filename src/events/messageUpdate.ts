import { Client, Message } from '../Client';

export default async (client: Client, oldMsg: Message, newMsg: Message) => {
	if (!oldMsg.partial && oldMsg.content === newMsg.content) return;
	if (newMsg.partial) newMsg = (await newMsg.fetch()) as Message;

	client.database.quotes.findOneAndUpdate({ messageID: newMsg.id }, { content: newMsg.content });
};

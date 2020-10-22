import { Client, Message } from '../Client';

export default async (client: Client, oldMsg: Message, newMsg: Message) => {
	// Make sure content was actually edited (loading embed content counts as edit too)
	if (!oldMsg.partial && oldMsg.content === newMsg.content) return;
	if (newMsg.partial) newMsg = (await newMsg.fetch()) as Message;

	// Update message content in quote
	const quote = await client.database.quotes.findOne({ messageID: newMsg.id });
	if (!quote) return;

	quote.content = newMsg.content;
	void quote.save();
};

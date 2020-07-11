import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const arg = args.shift()?.toLowerCase();
	switch (arg) {
		case 'board':
			return msg.client.getCommand('starboard')?.callback(msg, args);
		case undefined:
			return msg.channel.send(`You did not provide an ID bro ${msg.client.bruh}`);
		default:
			break;
	}

	const id = parseInt(arg);
	if (!id) return msg.channel.send(`That ain't a number chief ${msg.client.bruh}`);

	const quote = (await msg.client.database.quotes.findOne({ case: id })) || (await msg.client.database.quotes.findOne({ messageID: arg }));

	if (!quote) return msg.channel.send(`That isn't a valid quote ${msg.client.bruh} Try adding it`);

	if (quote.stars.indexOf(msg.author.id) >= 0) return msg.channel.send(`Bruh, you already starred this ${msg.client.bruh}`);

	quote.stars.push(msg.author.id);
	quote.save();

	return msg.channel.send(`Successfully starred the quote #${quote.case}`);
};

export const command: Command = {
	aliases: ['star', 'sq'],
	description: 'Star a quote',
	usage: '<Unique quote ID / Message ID>',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

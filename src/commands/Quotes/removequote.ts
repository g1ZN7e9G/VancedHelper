import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	if (!args.length) return msg.channel.send(`Provide a quote or message ID ${msg.client.bruh}`);

	const id = parseInt(args[0]);
	if (!id) return msg.channel.send(`That's not a valid number bro ${msg.client.bruh}`);

	const quote = (await msg.client.database.quotes.findOne({ case: id })) || (await msg.client.database.quotes.findOne({ messageID: args[0] }));

	if (!quote) return msg.channel.send(`That ain't a valid quote, chief ${msg.client.bruh}`);

	if (quote.authorID !== msg.author.id && !msg.member.permissions.has('MANAGE_MESSAGES'))
		return msg.channel.send(`Only the quote author or a Moderator can do this ${msg.client.bruh}`);

	quote.remove();

	return msg.channel.send(`Successfully deleted the quote ${quote.case}`);
};

export const command: Command = {
	aliases: ['deletequote', 'dq', 'rq', 'rmquote', 'rmq', 'delquote'],
	description: 'Remove a quote',
	usage: '[QuoteID | MessageID]',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

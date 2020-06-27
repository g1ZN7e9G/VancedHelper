import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const arg = args.shift()?.toLowerCase();
	switch (arg) {
		case 'add':
		case 'a':
			return msg.client.getCommand('addquote')?.callback(msg, args);
		case 's':
		case 'like':
		case 'upvote':
		case 'vote':
		case 'star':
			return msg.client.getCommand('starquote')?.callback(msg, args);
		case 'delete':
		case 'remove':
		case 'rm':
		case 'del':
			return msg.client.getCommand('removequote')?.callback(msg, args);
		case 'random':
		case undefined:
			return msg.client.getCommand('randomquote')?.callback(msg, args);
		default:
			break;
	}

	let quote;

	if (/^\d{1,16}$/.test(arg)) {
		quote = await msg.client.database.quotes.findOne({ case: parseInt(arg) });
		if (!quote) return msg.channel.send(`That's not a valid quote bro ${msg.client.bruh} Try adding it`);
	} else {
		const member = await msg.client.helpers.getMember(msg, [arg, ...args]);
		if (!member) return;

		quote = (await msg.client.database.quotes.find({ authorID: member.id })).random();
		if (!quote) return msg.channel.send(`That member has no quotes ${msg.client.bruh}`);
	}

	const user = await msg.client.users.fetch(quote.authorID).catch(() => null);
	const embed = msg.client
		.newEmbed()
		.setTimestamp(quote.timestamp || undefined)
		.setThumbnail(user?.displayAvatarURL({ dynamic: true }) || quote.author.avatar)
		.setImage(quote.attachment!)
		.setTitle(user?.tag || quote.author.name)
		.setDescription(`${quote.content}\n\n[Jump to message](${quote.link})`)
		.setFooter(`${msg.client.constants.emojis.star} ${quote.stars.length} | ID: ${quote.case}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['q'],
	description: 'Display a quote',
	usage: '<MemberResolvable | ID>',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

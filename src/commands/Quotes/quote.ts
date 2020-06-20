import { Command, Message } from '../../Client';
import { Quotes } from '../../database/Schemas/Quotes';

const callback = async (msg: Message, args: string[]) => {
	if (args[0] === 'add') {
		args.pop();
		return msg.client.getCommand('addquote')!.callback(msg, args.slice(1));
	}

	const member = args.length ? await msg.client.helpers.getMember(msg, args) : null;

	const quote: Quotes = member
		? (await msg.client.database.quotes.find({ authorID: member.id })).random()
		: (await msg.client.database.quotes.find()).random();

	if (!quote) {
		if (member) return msg.channel.send(`That member doesn't have any quotes. Try adding one via \`${msg.client.config.defaultPrefix}addquote\`!`);
		return msg.channel.send(`No quote found. Try adding one via \`${msg.client.config.defaultPrefix}addquote\`!`);
	}

	const user = await msg.client.users.fetch(quote.authorID).catch(() => null);
	const embed = msg.client
		.newEmbed()
		.setThumbnail(user?.displayAvatarURL({ dynamic: true }) || quote.author.avatar)
		.setImage(quote.attachment!)
		.setTitle(user?.tag || quote.author.name)
		.setDescription(`${quote.content}\n\n[Jump to message](https://discordapp.com/channels/${msg.guild!.id}/${quote.channelID}/${quote.messageID})`)
		.setFooter(quote.messageID);

	return msg.channel.send(embed);
};

export const command: Command = {
	cooldown: 5,
	aliases: [],
	description: '',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

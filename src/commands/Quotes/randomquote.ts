import { Command, Message } from '../../Client';
import { Quotes } from '../../database/Schemas/Quotes';

const callback = async (msg: Message) => {
	const quote = (await msg.client.database.quotes.find()).random() as Quotes | null;

	if (!quote) return msg.channel.send(`No quote found. Try adding one via \`${msg.client.config.defaultPrefix}addquote\`!`);

	const user = await msg.client.users.fetch(quote.authorID).catch(() => null);
	const embed = msg.client
		.newEmbed()
		.setThumbnail(user?.displayAvatarURL({ dynamic: true }) ?? quote.author.avatar)
		.setTimestamp(quote.timestamp || undefined)
		.setImage(quote.attachment!)
		.setTitle(user?.tag ?? quote.author.name)
		.setDescription(`${quote.content}\n\n[Jump to message](${quote.link})`)
		.setFooter(`${msg.client.constants.emojis.star} ${quote.stars.length} | ID: ${quote.case}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: [],
	description: 'Display a random quote',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

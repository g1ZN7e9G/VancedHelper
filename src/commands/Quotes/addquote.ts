import { Command, Message } from '../../Client';
import { VoiceChannel, TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	let messageID, channelID;

	// Allow message links or #channel messageID
	if (args.length === 1) {
		[, channelID, messageID] = msg.content.match(/https:\/\/discordapp.com\/channels\/\d+\/(\d+)\/(\d+)/) || [];
	} else {
		channelID = args[0]?.match(msg.client.constants.regex.snowflake)?.[0];
		messageID = args[1]?.match(msg.client.constants.regex.snowflake)?.[0];
	}

	if (!messageID || !channelID) return msg.channel.send(`Come on, use the command properly ${msg.client.bruh}`);

	const channel = msg.guild?.channels.cache.get(channelID);
	if (!channel) return msg.channel.send(`Pretty sure that's not a valid channel bro ${msg.client.bruh}`);

	if (channel instanceof VoiceChannel) return msg.channel.send(`What the fuck, that's a voice channel ${msg.client.bruh}`);

	const message = await (channel as TextChannel).messages.fetch(messageID).catch(() => null);
	if (!message) return msg.channel.send(`Pretty sure that's not a valid message lul ${msg.client.bruh}`);
	if (message.author.bot)
		return msg.channel.send(`${msg.client.constants.emojis.bot} Beep Boop. Do not bully robots`).then(() =>
			msg.author
				.send('<https://www.youtube.com/watch?v=Yy3dIicSI_0>')
				.then(() => void 0)
				.catch(() => void 0)
		);

	if (!message.content) return msg.channel.send(`That's an empty message pal ${msg.client.bruh}`);

	const entry = await msg.client.database.quotes.findOne({ messageID: message.id });
	if (entry) return msg.channel.send(`Pog, that quote is already added ${msg.client.constants.emojis.stonks}`);

	msg.client.database.quotes.create({
		messageID: message.id,
		channelID: message.channel.id,
		authorID: message.author.id,
		content: message.content,
		author: {
			avatar: message.author.displayAvatarURL({ dynamic: true }),
			name: message.author.tag
		},
		attachment: message.attachments.first()?.url
	});

	return msg.channel.send(`Quote successfully added! ${msg.client.constants.emojis.stonks}`);
};

export const command: Command = {
	cooldown: 5,
	aliases: ['aq', 'quoteadd'],
	description: 'Add a quote',
	usage: '<Message Link> OR <#Channel> <Message ID>',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

import { Command, Message } from '../../Client';
import { VoiceChannel, TextChannel } from 'discord.js';
import { join } from 'path';

const callback = async (msg: Message, args: string[]) => {
	let messageID, channelID;

	// Allow message links or #channel messageID
	if (args.length === 1) {
		[, channelID, messageID] = msg.content.match(/https:\/\/discord(?:app)?.com\/channels\/\d+\/(\d+)\/(\d+)/) || [];
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
				.send({ files: [join(__dirname, '../../../Assets/🤖.mp3')] })
				.then(() => void 0)
				.catch(() => void 0)
		);

	if (!message.content) return msg.channel.send(`That's an empty message pal ${msg.client.bruh}`);

	const entry = await msg.client.database.quotes.findOne({ messageID: message.id });
	if (entry) return msg.channel.send(`Pog, that quote is already added ${msg.client.constants.emojis.stonks}`);

	const cases = (await msg.client.database.quotes.find()).map(e => e.case || 0);
	const quote = await msg.client.database.quotes.create({
		messageID: message.id,
		channelID: message.channel.id,
		guildID: message.guild!.id,
		link: message.url,
		authorID: message.author.id,
		content: message.content,
		author: {
			avatar: message.author.displayAvatarURL({ dynamic: true }),
			name: message.author.tag
		},
		attachment: message.attachments.first()?.url,
		case: (cases.length ? Math.max(...cases) : 0) + 1,
		stars: []
	});

	return msg.channel.send(`Quote #${quote.case} successfully created ${msg.client.constants.emojis.stonks}`);
};

export const command: Command = {
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

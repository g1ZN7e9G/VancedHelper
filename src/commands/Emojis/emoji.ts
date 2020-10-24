import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	const emoteMatcher = msg.client.constants.regex.emotes;

	const urls = [];
	let match;
	while ((match = emoteMatcher.exec(msg.content))) {
		const emote = match[0];
		urls.push(`<https://cdn.discordapp.com/emojis/${msg.client.constants.regex.snowflake.exec(emote)![0]}.${emote.startsWith('<a') ? 'gif' : 'png'}>`);
	}

	const result = urls.length > 1 ? urls.join('\n') : urls[0].replace(/[<>]/g, '');

	return msg.channel.send(result.length > 2000 ? `That's too many emojis lmao ${msg.client.bruh}` : result);
};

export const command: Command = {
	aliases: ['e', 'emote'],
	description: "Get an emoji's url",
	usage: '<Emoji> (You can include as many as you want)',
	args: 1,
	devOnly: false,
	guildOnly: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

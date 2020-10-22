import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	const regex = /\d{17,19}/;

	const emojis = msg.client.constants.regex.emotes.exec(msg.content);

	if (!emojis || !emojis.length) return msg.channel.send('You did not provide any valid emojis!');

	const urls = emojis.map(e => `<https://cdn.discordapp.com/emojis/${regex.exec(e)![0]}.${e.startsWith('<a') ? 'gif' : 'png'}>`);

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

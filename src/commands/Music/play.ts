import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!args.length) {
		const res = msg.client.music.resume();
		if (res === false) return msg.channel.send(`The queue is empty`);
		else return msg.channel.send(`Continuing playback!`);
	}

	if (!msg.member?.voice?.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (msg.client.music.voiceConnection && msg.member.voice.channel.id !== msg.client.music.voiceConnection.channel.id)
		return msg.channel.send(`I am already playing in another voice chat ${msg.client.bruh}`);

	const song = await msg.client.music.add(args.join('+'));
	if (!song) return msg.channel.send(`I was unable to find a song matching your search.`);

	if (!msg.client.music.playing) {
		let output = 'Something went wrong. ';
		switch (await msg.client.music.start(msg)) {
			case 1:
				output += 'I am already playing in another channel.';
				break;
			case 2:
				output += 'You are not in a voice channel.';
				break;
			case 3:
				output += 'The queue is empty.';
				break;
			case 4:
				output += 'The current song is higher than the queue length. Resetting to 0.';
				msg.client.music.currentSong = 0;
				break;
			case 0:
				return msg.channel.send(`Now playing ${song.snippet.title}`);
		}
		return msg.channel.send(output);
	} else return msg.channel.send(`${song.snippet.title} successfully added to the queue!`);
};

export const command: Command = {
	aliases: ['p'],
	description: 'Play a song',
	usage: '<Song Name/URL>',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!args.length) {
		const res = msg.client.music.resume();
		if (!res) return msg.channel.send(`The queue is empty`);

		return msg.channel.send(`Continuing playback!`);
	}

	if (!msg.member?.voice.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (msg.client.music.voiceConnection && msg.member.voice.channel.id !== msg.client.music.voiceConnection.channel.id)
		return msg.channel.send(`I am already playing in another voice chat ${msg.client.bruh}`);

	const song = await msg.client.music.add(args.join(' '), msg);
	if (!song) return msg.channel.send(`I was unable to find a song matching your search.`);

	if (!msg.client.music.playing || !msg.client.music.streamDispatcher) {
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
			case true:
				return msg.channel.send(`Successfully added \`${song.title}\` to the queue!`, msg.client.music.songEmbed(song));
			case false:
				break;
		}
		return msg.channel.send(output);
	}
	return msg.channel.send(`Successfully added \`${song.title}\` to the queue!`, msg.client.music.songEmbed(song));
};

export const command: Command = {
	aliases: ['p'],
	description: 'Play a song',
	usage: '<Song Name/URL>',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

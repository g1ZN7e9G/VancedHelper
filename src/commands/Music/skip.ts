import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.member?.voice?.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.playing) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection?.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (!args.length) {
		const res = await msg.client.music.skip(msg.member.hasPermission('MANAGE_MESSAGES') || msg.member.voice.channel?.members.size === 2);
		if (res === false) return msg.channel.send(`The queue is empty ${msg.client.bruh}`);
		if (typeof res === 'string') return msg.channel.send(`Skip request sent! ${res}`);

		const nowPlaying = msg.client.music.nowPlaying;
		if (!nowPlaying) return msg.channel.send(`Successfully skipped!`);
		return msg.channel.send(`Successfully skipped! Now playing \`${nowPlaying.title}\``);
	} else {
		const spot = parseInt(args[0]);
		if (!spot) return msg.channel.send(`That is not a valid number.`);
		const song = msg.client.music.queue[spot - 1];
		if (!song) return msg.channel.send(`That's not a valid track!`);
		if (spot - 1 === msg.client.music.currentSong)
			return msg.channel.send(`This song is currently playing. Please use this command without arguments to skip it.`);

		if (!msg.member.permissions.has('MANAGE_MESSAGES') && song.addedBy.id !== msg.author.id)
			return msg.channel.send(`You do not have permission to remove this song from the queue.`);

		msg.client.music.queue.splice(spot - 1, 1);
		return msg.channel.send(`Successfully removed \`${song.title}\``);
	}
};

export const command: Command = {
	aliases: ['s', 'next'],
	description: 'Skip the current song',
	usage: '[Number of song to remove from queue]',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

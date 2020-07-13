import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.member?.voice?.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.playing) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection?.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (msg.client.music.currentSong === 0) return msg.channel.send(`This is the first song in the queue. Cannot rewind.`);

	const res = await msg.client.music.back(msg.member.hasPermission('MANAGE_MESSAGES') || msg.member.voice.channel?.members.size === 2);
	if (res === false) return msg.channel.send(`The queue is empty ${msg.client.bruh}`);
	if (typeof res === 'string') return msg.channel.send(`Rewind request sent! ${res}`);

	const nowPlaying = msg.client.music.nowPlaying;
	if (!nowPlaying) return msg.channel.send(`Successfully went rewinded!`);
	return msg.channel.send(`Successfully rewinded! Now playing ${nowPlaying.title}`);
};

export const command: Command = {
	aliases: ['b', 'previous', 'rewind'],
	description: 'Go to the previous song',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.member?.voice.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.playing) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection?.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (!msg.member.hasPermission('MANAGE_MESSAGES') && msg.member.voice.channel.members.size !== 2) return msg.channel.send(`Only a moderator can do this.`);

	const track = parseInt(args[0], 10);

	if (!track || track > msg.client.music.queue.length || track < 1) return msg.channel.send(`That is not a valid spot in the queue.`);

	msg.client.music.currentSong = track - 2;
	void msg.client.music.next();

	const song = msg.client.music.nowPlaying;

	return msg.channel.send(song ? `Successfully jumped to \`${song.title}\`` : 'Something went wrong. Please try again');
};

export const command: Command = {
	aliases: ['j'],
	description: 'Jump to a specific spot in the queue',
	usage: '<Spot>',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

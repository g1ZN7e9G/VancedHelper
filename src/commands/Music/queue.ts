import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const q = msg.client.music.queue;
	if (!q.length) return msg.channel.send(`I am not playing any music ${msg.client.bruh}`);

	const songs = q.slice(Math.max(0, msg.client.music.currentSong - 5), Math.min(q.length, msg.client.music.currentSong + 5));

	const output = songs.map(s => ({
		name: q.indexOf(s) === msg.client.music.currentSong ? `>> ${q.indexOf(s) + 1} <<` : q.indexOf(s) + 1,
		value: `\`${msg.client.music.secondsToTime(s.length)}\` - ${s.title}`
	}));

	return msg.channel.send(
		msg.client
			.newEmbed('INFO')
			.setTitle('Queue')
			.addFields(output)
			.setFooter(
				output.length ? 'Play duration: ' + msg.client.music.secondsToTime(q.reduce((x, y) => x + parseInt(y.length), 0)) : 'The queue is empty!'
			)
	);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

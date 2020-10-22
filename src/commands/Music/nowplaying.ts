import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	const song = msg.client.music.nowPlaying;

	if (!song || !msg.client.music.streamDispatcher) return msg.channel.send(`I am not playing any music ${msg.client.bruh}`);

	const playDuration = msg.client.music.streamDispatcher.streamTime / 1000;
	const howFar = Math.round((playDuration / parseInt(song.length, 10)) * 20);

	return msg.channel.send(
		msg.client.music
			.songEmbed(song)
			.setDescription(
				`\`${msg.client.music.secondsToTime(playDuration)}\` ${'-'.repeat(howFar)}🔵${'-'.repeat(20 - howFar)} \`${msg.client.music.secondsToTime(
					song.length
				)}\`\n\nAdded by: ${song.addedBy.name}`
			)
	);
};

export const command: Command = {
	aliases: ['np'],
	description: 'See what song I am currently playing',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

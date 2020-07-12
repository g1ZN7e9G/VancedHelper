import { Client } from '../Client';
import { VoiceState } from 'discord.js';

export default (client: Client, oldState: VoiceState, newState: VoiceState) => {
	const channel = oldState.channel || newState.channel;
	if (!channel) return;

	if (!channel.members.has(client.user!.id)) return;

	if (channel.members.size === 1) {
		client.music.textChannel?.send(
			`All members have left the voice chat, so I paused the playback.\nI will leave the voice chat and clear the queue in 1 minute.`
		);
		client.music.pause();

		if (client.music.leaveTimeout) clearTimeout(client.music.leaveTimeout);
		client.music.leaveTimeout = setTimeout(() => client.music.stop(), 1000 * 60);
	}

	if (channel.members.size > 1 && client.music.leaveTimeout) {
		const np = client.music.nowPlaying;
		if (np) client.music.textChannel?.send(`Resuming where we left off: \`${np.title}\``);
		client.music.resume();

		clearTimeout(client.music.leaveTimeout);
	}
};

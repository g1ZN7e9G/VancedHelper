import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.member?.voice?.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.playing) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection?.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (!msg.member?.hasPermission('MANAGE_MESSAGES') && msg.member.voice.channel?.members.size !== 2) return msg.channel.send(`Only a moderator can do this.`);

	msg.client.music.queue = msg.client.music.queue.sort(() => 0.5 - Math.random());

	return msg.channel.send(`Successfully shuffled the queue!`);
};

export const command: Command = {
	aliases: [],
	description: 'Shuffle the queue',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

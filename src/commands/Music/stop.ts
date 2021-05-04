import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	if (!msg.member?.voice.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.voiceConnection) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (!msg.member.hasPermission('MANAGE_MESSAGES') && msg.member.voice.channel.members.size !== 2) return msg.channel.send(`Only a moderator can do this.`);

	msg.client.music.stop();

	return msg.channel.send(`Successfully stopped music playback.`);
};

export const command: Command = {
	aliases: [],
	description: 'Stop music playback',
	usage: '',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['SPEAK', 'CONNECT'],
	callback: callback
};

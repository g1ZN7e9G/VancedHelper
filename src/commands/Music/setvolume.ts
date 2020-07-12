import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.member?.voice?.channel) return msg.channel.send(`You are not in a voice channel ${msg.client.bruh}`);
	if (!msg.client.music.playing) return msg.channel.send(`I'm not even playing anything ${msg.client.bruh}`);
	if (msg.member.voice.channel.id !== msg.client.music.voiceConnection?.channel.id)
		return msg.channel.send(`You're not even in this vc smh ${msg.client.bruh}`);

	if (!msg.member?.hasPermission('MANAGE_MESSAGES') && msg.member.voice.channel?.members.size !== 2) return msg.channel.send(`Only a moderator can do this.`);

	const vol = parseFloat(args[0]);
	if (vol < 0 || vol > 2) return msg.channel.send(`Invalid volume. Please provide a value between 0 and 2.`);

	msg.client.music.streamDispatcher?.setVolume(vol);

	return msg.channel.send(`Volume has successfully been set to ${Math.round(vol * 100)}%`);
};

export const command: Command = {
	aliases: ['volume', 'setvol', 'vol'],
	description: 'Set my volume',
	usage: '<Volume (0.1 is 10%, 2 is 200%)>',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

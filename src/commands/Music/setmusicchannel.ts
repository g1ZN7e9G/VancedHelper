import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;
	const channel = msg.mentions.channels.first() || msg.channel;

	const settings =
		(await msg.client.database.guildSettings.findOne({ guild: msg.guild.id })) ||
		(await msg.client.database.guildSettings.create({ guild: msg.guild.id, musicChannel: '' }));

	settings.musicChannel = channel.id;
	settings.save();

	return msg.channel.send(`Music channel successfully set to ${channel}!`);
};

export const command: Command = {
	aliases: ['musicchannel', 'music'],
	description: 'Set the channel to use as music channel',
	usage: '<#Channel (Defaults to current channel)>',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: ['MANAGE_MESSAGES'],
	botPermission: [],
	callback: callback
};

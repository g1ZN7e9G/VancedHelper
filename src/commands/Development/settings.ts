import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const [setting, target] = args.map(a => a.toLowerCase());

	const dbEntry =
		(await msg.client.database.guildSettings.findOne({ guild: msg.guild.id })) || (await msg.client.database.guildSettings.create({ guild: msg.guild.id }));

	const channel = msg.mentions.channels.first()?.id || msg.guild.channels.cache.get(target.replace(/[^\d]/, ''))?.id;
	let role;
	let m;
	switch (setting) {
		case undefined:
			return;
		case 'modlogchannel':
			if (!channel) return msg.channel.send(`You did not a valid channel!`);
			dbEntry.modLogChannel = channel;
			m = msg.channel.send(`Successfully set the modlogchannel to <#${channel}>!`);
			break;
		case 'musicchannel':
			if (!channel) return msg.channel.send(`You did not a valid channel!`);
			dbEntry.musicChannel = channel;
			m = msg.channel.send(`Successfully set the musicchannel to <#${channel}>!`);
			break;
		case 'boostrole':
			role = await msg.client.helpers.getRole(msg, args, 1);
			if (!role) return;
			dbEntry.boosterRole = role.id;
			m = msg.channel.send(`Successfully set the boostrole to ${role.name}!`);
			break;
		case 'modrole':
			role = await msg.client.helpers.getRole(msg, args, 1);
			if (!role) return;
			dbEntry.modRole = role.id;
			m = msg.channel.send(`Successfully set the modrole to ${role.name}!`);
			break;
		case 'spammerrole':
			role = await msg.client.helpers.getRole(msg, args, 1);
			if (!role) return;
			dbEntry.spammerRole = role.id;
			m = msg.channel.send(`Successfully set the spammerrole to ${role.name}!`);
		default:
			return msg.channel.send(`${setting} is not a valid setting.`);
	}
	dbEntry.save();

	return await m;
};

export const command: Command = {
	aliases: [],
	description: 'Change a setting',
	usage: '<modlogchannel | musicchannel | boostrole | modrole | spammerrole> <Channel / Role>',
	devOnly: true,
	guildOnly: true,
	args: 2,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

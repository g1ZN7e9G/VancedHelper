import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const settings = await msg.client.database.guildSettings.findOne({ guild: msg.guild.id });
	if (!settings || !settings.modRole) throw new Error(`Please specify a modrole.`);
	if (!settings.modLogChannel) throw new Error(`Please specify a modlog channel.`);

	if (!msg.member.roles.cache.has(settings.modRole)) return;

	if (!settings.muteRole) {
		const m = await msg.channel.send(`No mute role found. Creating now...`);

		const role = await msg.guild.roles.create({ data: { name: 'VancedHelper-Mute' } }).catch(() => null);
		if (!role) return m.edit(`I was unable to create a mute role.`);

		await Promise.all(
			msg.guild.channels.cache
				.filter(c => Boolean(c.permissionsFor(msg.guild.me!)?.has('VIEW_CHANNEL')))
				.map(c =>
					c
						.updateOverwrite(role, {
							SEND_MESSAGES: false,
							ADD_REACTIONS: false,
							SPEAK: false
						})
						.catch(() => null)
				)
		).catch(() => null);

		settings.muteRole = role.id;
		void settings.save();
		if (m.deletable) m.delete().catch(() => null);
	}

	const parsedDuration = msg.client.helpers.parseTimeString(msg.content);
	if (parsedDuration) parsedDuration.matches.forEach(m => args.splice(args.indexOf(m), 1));

	const target = await msg.client.helpers.getMember(msg, args, 0);
	if (!target) return;

	const reason = args.splice(1).join(' ');
	if (!reason) return msg.channel.send(`Please provide a reason.`);

	const role = msg.guild.roles.cache.get(settings.muteRole);
	if (!role) throw new Error('Mute role not found!');

	const action = target.roles.cache.has(role.id) ? 'UNMUTE' : 'MUTE';

	const channel = msg.guild.channels.cache.get(settings.modLogChannel);
	if (!channel || !(channel instanceof TextChannel)) throw new Error(`Modlog channel unreachable or not a TextChannel.`);

	return msg.client.helpers.createInfraction(msg, channel, role, action, target, msg.author, reason, parsedDuration?.duration);
};

export const command: Command = {
	aliases: [],
	description: 'Mute the target',
	usage: '<User Resolvable> <Reason>',
	devOnly: false,
	guildOnly: true,
	args: 2,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

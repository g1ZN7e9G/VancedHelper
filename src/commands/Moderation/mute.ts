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
				.filter(c => !!c.permissionsFor(msg.guild!.me!)?.has('VIEW_CHANNEL'))
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
		settings.save();
		if (m.deletable) m.delete().catch(() => null);
	}

	const target = await msg.client.helpers.getMember(msg, args, 0);
	if (!target) return;

	const reason = args.splice(1).join(' ') || 'No reason provided!';

	let action = '';
	let m;
	if (target.roles.cache.has(settings.muteRole)) {
		const success = await target.roles.remove(settings.muteRole).catch(() => false);
		if (!success) return msg.channel.send(`Could not muted ${target.user.username}.`);
		else m = msg.channel.send(`Successfully unmuted ${target.user.username}.`);
		action = 'Unmute';
	} else {
		const success = await target.roles.add(settings.muteRole).catch(() => false);
		if (!success) return msg.channel.send(`Could not mute ${target.user.username}.`);
		else m = msg.channel.send(`Successfully muted ${target.user.username}.`);
		action = 'Mute';
	}

	const embed = msg.client
		.newEmbed('INFO')
		.setTitle(action || 'Something went wrong.')
		.addFields([
			{
				name: 'User',
				value: `Mention: ${target}\nTag: ${target.user.tag}\nID: ${target.id}}`
			},
			{
				name: 'Moderator',
				value: `Mention: ${msg.author}\nTag: ${msg.author.tag}\nID: ${msg.author.id}}`
			},
			{
				name: 'Reason',
				value: reason
			}
		]);

	const channel = msg.guild.channels.cache.get(settings.modLogChannel);
	if (!channel || !(channel instanceof TextChannel)) throw new Error(`Modlog channel unreachable or not a TextChannel.`);

	channel.send(embed);

	return m;
};

export const command: Command = {
	aliases: [],
	description: 'Mute the target',
	usage: '<User Resolvable> [Reason]',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

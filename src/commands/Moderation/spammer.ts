import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const settings = await msg.client.database.guildSettings.findOne({ guild: msg.guild.id });
	if (!settings || !settings.modRole) throw new Error(`Please specify a modrole.`);
	if (!settings || !settings.spammerRole) throw new Error(`Please specify a spammer role.`);
	if (!settings.modLogChannel) throw new Error(`Please specify a modlog channel.`);

	if (!msg.member.roles.cache.has(settings.modRole)) return;

	const target = await msg.client.helpers.getMember(msg, args, 0);
	if (!target) return;

	const reason = args.splice(1).join(' ') || 'No reason provided!';

	let action = '';
	let m;
	if (target.roles.cache.has(settings.spammerRole)) {
		const success = await target.roles.remove(settings.spammerRole).catch(() => false);
		if (!success) return msg.channel.send(`Failed removing the spammer role from ${target.user.username}.`);
		else m = msg.channel.send(`Successfully removed the spammer role from ${target.user.username}.`);
		action = 'Removed Spammer Role';
	} else {
		const success = await target.roles.add(settings.spammerRole).catch(() => false);
		if (!success) return msg.channel.send(`Failed assigning the spammer role to ${target.user.username}.`);
		else m = msg.channel.send(`Successfully assigned the spammer role to ${target.user.username}.`);
		action = 'Added to Spammer Role';
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
	description: 'Makes the target unable to talk in non-spammy channels.',
	usage: '<User Resolvable> [Reason]',
	devOnly: false,
	guildOnly: true,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

import { Command, Message } from '../../Client';
import { TextChannel } from 'discord.js';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const settings = await msg.client.database.guildSettings.findOne({ guild: msg.guild.id });
	if (!settings || !settings.modRole) throw new Error(`Please specify a modrole.`);
	if (!settings.spammerRole) throw new Error(`Please specify a spammer role.`);
	if (!settings.modLogChannel) throw new Error(`Please specify a modlog channel.`);

	if (!msg.member.roles.cache.has(settings.modRole)) return;

	const parsedDuration = msg.client.helpers.parseTimeString(msg.content);
	if (parsedDuration) parsedDuration.matches.forEach(m => args.splice(args.indexOf(m), 1));

	const target = await msg.client.helpers.getMember(msg, args, 0);
	if (!target) return;

	const reason = args.splice(1).join(' ');
	if (!reason) return msg.channel.send(`Please provide a reason.`);

	const role = msg.guild.roles.cache.get(settings.spammerRole);
	if (!role) throw new Error('Spammer role not found!');

	const action = target.roles.cache.has(role.id) ? 'UNSPAM' : 'SPAM';

	const channel = msg.guild.channels.cache.get(settings.modLogChannel);
	if (!channel || !(channel instanceof TextChannel)) throw new Error(`Modlog channel unreachable or not a TextChannel.`);

	return msg.client.helpers.createInfraction(msg, channel, role, action, target, msg.author, reason, parsedDuration?.duration);
};

export const command: Command = {
	aliases: [],
	description: 'Makes the target unable to talk in non-spammy channels.',
	usage: '<User Resolvable> <Reason>',
	devOnly: false,
	guildOnly: true,
	args: 2,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

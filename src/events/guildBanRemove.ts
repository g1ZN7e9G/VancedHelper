import { Client } from '../Client';
import { Guild, User, TextChannel } from 'discord.js';

export default async (client: Client, guild: Guild, user: User) => {
	const settings = await client.database.guildSettings.findOne({ guild: guild.id });
	if (!settings || !settings.modLogChannel) throw new Error('Please specify a modlog channel.');

	// Wait 5 seconds to make sure it has been logged to the audit log
	await client.helpers.wait(5);

	const log = (await guild.fetchAuditLogs({ limit: 5, type: 'MEMBER_BAN_REMOVE' })).entries.find(e => (e.target as User).id === user.id);

	const embed = client
		.newEmbed('INFO')
		.setTitle(`User unbanned`)
		.setThumbnail(user.displayAvatarURL({ size: 512, dynamic: true }))
		.addFields([
			{
				name: 'User',
				value: `Mention: ${user}\nTag: ${user.tag}\nID: ${user.id}}`
			},
			{
				name: 'Moderator',
				value: log ? `Mention: ${log.executor}\nTag: ${log.executor.tag}\nID: ${log.executor.id}}` : 'No audit log entry found.'
			},
			{
				name: 'Reason',
				value: log ? log.reason || 'No reason provided.' : 'No audit log entry found.'
			}
		]);

	const channel = guild.channels.cache.get(settings.modLogChannel);
	if (!channel || !(channel instanceof TextChannel)) throw new Error(`Modlog channel <#${settings.modLogChannel}> unreachable.`);

	channel.send(embed);
};

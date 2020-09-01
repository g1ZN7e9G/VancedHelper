import { Client } from '../Client';
import { TextChannel } from 'discord.js';

export default (client: Client) => {
	if (!client.user) return;

	const channel = client.getChannel('info');

	const info = [
		{ key: 'Prefix', val: client.config.defaultPrefix },
		{ key: 'Guilds', val: client.guilds.cache.size },
		{ key: 'Channels', val: client.channels.cache.size },
		{ key: 'Users', val: client.guilds.cache.reduce((x, y) => x + y.memberCount, 0) },
		{ key: 'Database name', val: client.database.quotes.db.name },
		{ key: 'Database', val: Object.keys(client.database.quotes.db.collections).join(', ') }
	];

	// Debug useful information
	console.info(`Connected to Discord as ${client.user.tag} - ${client.user.id}\n` + info.map(obj => `${obj.key}: ${obj.val}`).join('\n'));
	channel.send(
		client
			.newEmbed('INFO')
			.setTitle('I just started!')
			.setDescription(info.map(obj => `**${obj.key}:** \`${obj.val}\``).join('\n'))
	);

	client.database.infractions.find().then(infractions =>
		infractions.forEach(infraction => {
			const end = Date.now() - infraction.end;
			if (end < 0) return infraction.remove();

			return setTimeout(async () => {
				const guild = client.guilds.cache.get(infraction.guildID);
				if (!guild) return infraction.remove();
				const member = await guild.members.fetch(infraction.userID).catch(() => null);
				if (!member) return infraction.remove();

				const settings = await client.database.guildSettings.findOne({ guild: guild.id });
				const roleID = infraction.infractionType === 'MUTE' ? settings?.muteRole : settings?.spammerRole;
				if (!settings || !settings.modLogChannel || !roleID) return infraction.remove();

				const channel = guild.channels.cache.get(settings.modLogChannel);
				const role = guild.roles.cache.get(roleID);
				if (!channel || !(channel instanceof TextChannel) || !role) return infraction.remove();

				const success = await client.helpers.giveRole(null, member, role, true);

				if (success) member.send(`The timer for your punishment has ended!`);

				return channel.send(
					success
						? `The timer for ${member.user.tag}'s punishment has ended so I removed their role!`
						: `The timer for ${member.user.tag}'s punishment has ended but removing their role failed!`
				);
			}, end);
		})
	);
};

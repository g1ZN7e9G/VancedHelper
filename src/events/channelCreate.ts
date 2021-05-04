import { Client } from '../Client';
import { DMChannel, GuildChannel } from 'discord.js';

export default async (client: Client, channel: DMChannel | GuildChannel) => {
	if (!(channel instanceof GuildChannel)) return;

	const settings = await client.database.guildSettings.findOne({ guild: channel.guild.id });
	if (!settings || !settings.muteRole) throw new Error('Please specify a MuteRole!');

	if (channel.manageable)
		channel
			.updateOverwrite(settings.muteRole, {
				SEND_MESSAGES: false,
				ADD_REACTIONS: false,
				SPEAK: false
			})
			.catch(() => null);
};

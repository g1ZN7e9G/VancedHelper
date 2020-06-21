import { Client } from '../Client';
import { GuildMember } from 'discord.js';

export default async (client: Client, oldMember: GuildMember, newMember: GuildMember) => {
	if (newMember.partial) newMember = await newMember.fetch();

	const boosterRole = newMember.roles.cache.find(r => r.name === 'Nitro Booster');

	if (!boosterRole) {
		const entry = await client.database.colourRoles.findOne({ userID: newMember.id });
		// BRUH THEY UNBOOSTED
		if (entry) {
			const role = newMember.guild.roles.cache.get(entry.roleID);
			if (role && !role.deleted) role.delete().catch(() => null);
			client.getChannel('info').send(`${newMember} (${newMember.user.tag}) just unboosted :/`);
		}
	}

	// POGGERS NEW BOOSTER
	if (boosterRole && !oldMember.roles.cache.has(boosterRole.id)) {
		// Log to info channel
		client.getChannel('info').send(`${newMember} (${newMember.user.tag}) just boosted ${client.constants.emojis.stonks}`);

		const dbEntry = await client.database.colourRoles.findOne({ userID: newMember.id });
		// Restore their old role
		if (dbEntry) {
			const role = await newMember.guild.roles.create({
				data: {
					name: dbEntry.roleName,
					color: dbEntry.roleColour,
					position: newMember.roles.highest.position + 1
				}
			});
			dbEntry.roleID = role.id;
			dbEntry.save();

			newMember.roles.add(role);
		}

		const text = dbEntry
			? `Hello ${newMember}, thank you for re-boosting! I restored your colour role.`
			: `Hello ${newMember}, thank you for boosting! Make sure to pick up the beta apk in ${client.getChannel(
					'testers'
			  )} and consider creating a custom role. See \`${client.config.defaultPrefix}help colourme\` for more info`;

		// Wait 5 seconds to make sure they got access to the channel fully
		setTimeout(() => client.getChannel('boosters').send(text), 1000 * 5);
	}
};

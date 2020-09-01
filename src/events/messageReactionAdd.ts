import { Client } from '../Client';
import { MessageReaction, User } from 'discord.js';

export default async (client: Client, potentiallyUncachedReaction: MessageReaction, user: User) => {
	const reaction = potentiallyUncachedReaction.partial ? await potentiallyUncachedReaction.fetch().catch(() => null) : potentiallyUncachedReaction;
	if (!reaction) return;

	client.pages.browse(reaction, user);

	if (!client.helpers.isGuild(reaction.message)) return;

	const reactionRoleEntry = await client.database.reactionRoles.findOne({ messageID: reaction.message.id });
	if (!reactionRoleEntry) return;

	const emojiID = reaction.emoji.id ?? reaction.emoji.name;

	const reactionRole = reactionRoleEntry.reactionRoles.find(r => r.emojiID === emojiID);
	if (!reactionRole) return;

	const role = reaction.message.guild.roles.cache.get(reactionRole.roleID);
	if (!role) return;

	const member = reaction.message.guild.member(user);
	if (!member || member.roles.cache.has(role.id)) return;

	const success = await member.roles.add(role).catch(() => undefined);

	if (success) user.send(`Successfully gave you the role \`${role.name}\`!`).catch(() => null);
};

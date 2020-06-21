import { Client } from '../Client';
import { MessageReaction, User } from 'discord.js';

export default async (client: Client, reaction: MessageReaction, user: User) => {
	if (reaction.partial) reaction = (await reaction.fetch().catch(() => null)) as MessageReaction;
	if (!reaction) return;

	client.pages.browse(reaction, user);
};

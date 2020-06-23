import { Client, Message, FullCommand } from '../Client';
import { MessageReaction, User } from 'discord.js';

export default async (client: Client, msg: Message, command: FullCommand, res: Message | void) => {
	msg.client.activeCommands.delete(msg.author.id);
	msg.client.cooldowns.add(msg.author.id, command);

	// Allow the user to delete the command output within 10 seconds after use
	if (res) {
		const t = client.constants.emojis.trash;

		const success = await res.react(t).catch(() => false);
		if (!success) return;

		const reacted = await res.awaitReactions((r: MessageReaction, u: User) => u.id === msg.author.id && r.emoji.name === t, {
			time: 10 * 1000,
			max: 1
		});

		if (reacted.size) {
			if (res.deletable) res.delete({ reason: 'Cancelled by user' }).catch(() => null);
			if (msg.deletable) msg.delete({ reason: 'Cancelled by user' }).catch(() => null);
		} else
			res.reactions.cache
				.get(t)
				?.users.remove(client.user!.id)
				.catch(() => null);
	}
};

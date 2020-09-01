import { GuildMember, User, Collection } from 'discord.js';
import { FullCommand } from '../';
import { config } from '../../config';

export const Cooldowns = {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	cooldowns: new Collection() as Collection<string, Collection<string, number>>,

	get(id: string | User | GuildMember, command: FullCommand) {
		if (typeof id !== 'string') id = id.id;

		if (config.developers.includes(id)) return false;

		if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());

		const now = Date.now();

		const cooldownAmount = command.cooldown * 1000;

		const userCooldown = this.cooldowns.get(command.name)!.get(id);
		if (!userCooldown) return false;

		const expirationTime = userCooldown + cooldownAmount;

		if (now < expirationTime) return (expirationTime - now) / 1000;

		return false;
	},

	add(id: string | User | GuildMember, command: FullCommand) {
		if (typeof id !== 'string') id = id.id;

		if (config.developers.includes(id)) return;

		if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());

		const timestamps = this.cooldowns.get(command.name)!;

		timestamps.set(id, Date.now());
	}
};

import { Client, Message } from '../Client';
import { Collection } from 'discord.js';

export const listener = async (client: Client, messages: Collection<string, Message>) => {
	messages.forEach(msg => {
		client.emit('messageDelete', msg);
	});
};

import { Client, Message } from '../Client';
import { Collection } from 'discord.js';

export default (client: Client, messages: Collection<string, Message>) => {
	// Emit each message as individual message delete event
	messages.forEach(msg => {
		client.emit('messageDelete', msg);
	});
};

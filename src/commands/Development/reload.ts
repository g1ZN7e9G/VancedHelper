import { Command, Message } from '../../Client';
import { Collection } from 'discord.js';

const callback = async (msg: Message, _args: string[]) => {
	msg.client.commands = new Collection();
	msg.client.removeAllListeners();

	msg.client.initCommands();
	msg.client.initListeners();

	return msg.channel.send(`Successfully reloaded all commands and listeners! There's ${msg.client.commands.size} commands.`);
};

export const command: Command = {
	aliases: [],
	description: 'Reload all commands and listeners',
	usage: '',
	devOnly: true,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

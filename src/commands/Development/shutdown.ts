import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	await msg.channel.send(`Okay, shutting down!`);

	msg.client.destroy();
	process.exit();
};

export const command: Command = {
	aliases: [],
	description: 'Shut down the bot',
	usage: '',
	devOnly: true,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	const sentMsg = await msg.channel.send('Pinging...');
	// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
	sentMsg.edit(`Pong! Took \`${sentMsg.createdTimestamp - (msg.editedTimestamp || msg.createdTimestamp)}ms\`.`).catch(() => null);
	return sentMsg;
};

export const command: Command = {
	cooldown: 10,
	aliases: ['heartbeat', 'ms'],
	description: 'Check my ping',
	usage: '',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

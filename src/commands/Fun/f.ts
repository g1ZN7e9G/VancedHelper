import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	return msg.channel.send(
		args.length ? `<:pressF:731671468269895680> ${msg.author.username} pays respects for ${args.join(' ')}` : '<:pressF:731671401118957568>'
	);
};

export const command: Command = {
	aliases: ['sayf', 'respect', 'respects', 'payrespects'],
	description: 'Pay your respects',
	usage: '[Thing to pay respects for]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

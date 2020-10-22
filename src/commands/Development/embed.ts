import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	try {
		const code = JSON.parse(args.join(' '));
		return msg.channel.send(null, { embed: code });
	} catch (err) {
		return msg.channel.send(`Invalid JSON body:\n${(err.message as string).toCodeblock('js')}`);
	}
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '<JSON>',
	devOnly: true,
	guildOnly: false,
	args: 1,
	memberPermission: [],
	botPermission: ['EMBED_LINKS'],
	callback: callback
};

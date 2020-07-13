import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	return msg.channel.send(`<https://github.com/YTVanced/VancedHelper>`);
};

export const command: Command = {
	aliases: ['sourcecode', 'code'],
	description: 'Get a link to my github page',
	usage: '',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

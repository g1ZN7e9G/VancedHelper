import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const halalLevel = Math.floor(Math.random() * 21);

	const bar = '`Halal` ' + '-'.repeat(halalLevel) + '🔵' + '-'.repeat(20 - halalLevel) + ' `Haram`';

	const embed = msg.client
		.newEmbed('BASIC')
		.setTitle(`Halal Meter`)
		.setDescription(`${args.join(' ')} is ${halalLevel * 5}% haram. \n${bar}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['howharam', 'halal', 'haram'],
	description: 'Find out how halal something is',
	usage: '<The thing>',
	devOnly: false,
	guildOnly: false,
	args: 1,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

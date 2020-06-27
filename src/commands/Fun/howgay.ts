import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length ? await msg.client.helpers.getUser(msg, args) : msg.author;
	if (!user) return;

	const percentage = Math.floor(Math.random() * 101);
	const barAmount = Math.round(percentage / 10);
	const bar = '▰'.repeat(barAmount) + '▱'.repeat(10 - barAmount);

	const embed = msg.client.newEmbed('BASIC').setTitle('Gay rater 100™️').setDescription(`${user} is ${percentage}% gay\n${bar}`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['gay'],
	description: 'Find out how gay you are',
	usage: '[User]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

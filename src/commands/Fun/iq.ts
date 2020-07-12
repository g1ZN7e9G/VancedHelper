import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const user =
		msg.mentions.users.first()?.username || (await msg.client.users.fetch(args[0]).catch(() => null))?.username || args.join(' ') || msg.author.username;

	const iq = ["xinto", "x1nto"].some(n => user.toLowerCase().includes(n)) ? 5 : user.toLowerCase().includes("mint") ? 2 : Math.floor(Math.random() * 301);
 
	const embed = msg.client.newEmbed('BASIC').setTitle('IQ Machine').setDescription(`${user} has an IQ of **${iq}**`);

	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['intelligence', 'howsmart'],
	description: 'Find out your IQ',
	usage: '[User]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

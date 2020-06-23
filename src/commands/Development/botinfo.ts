import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const output = msg.client
		.newEmbed('INFO')
		.setThumbnail('https://cdn.discordapp.com/avatars/658352336787472386/7a77a973f56971532016ebc055f9c381.png')
		.setTitle('Information about the bot')
		.addField('Version', process.env.VERSION ? process.env.VERSION : 'unknown', false)
		.addField(
			'Commit',
			process.env.COMMIT ? `[${process.env.COMMIT.slice(0, 7)}](https://github.com/YTVanced/VancedHelper/commit/${process.env.COMMIT})` : 'unknown',
			false
		)
		.addField('Commit message', process.env.COMMIT_MESSAGE ? process.env.COMMIT_MESSAGE : 'unknown', false);

	return msg.channel.send(output);
};

export const command: Command = {
	cooldown: 0,
	aliases: [],
	description: 'Display bot info',
	usage: '',
	devOnly: true,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

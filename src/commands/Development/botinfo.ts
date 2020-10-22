import { Command, Message } from '../../Client';

const callback = async (msg: Message) => {
	const output = msg.client
		.newEmbed('INFO')
		.setThumbnail('https://cdn.discordapp.com/avatars/658352336787472386/7a77a973f56971532016ebc055f9c381.png')
		.setTitle('Information about the bot')
		.addFields([
			{
				name: 'Version',
				value: process.env.VERSION ?? 'unknown'
			},
			{
				name: 'Commit',
				value: process.env.COMMIT
					? `[${process.env.COMMIT.slice(0, 7)}](https://github.com/YTVanced/VancedHelper/commit/${process.env.COMMIT})`
					: 'unknown'
			},
			{
				name: 'Commit message',
				value: process.env.COMMIT_MESSAGE ?? 'unknown'
			}
		]);

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

import { Command, Message } from '../../Client';
import { AllowedImageFormat, ImageSize } from 'discord.js';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	const user = args.length ? await msg.client.helpers.getUser(msg, args) : msg.author;
	if (!user) return;

	const mainUrl = user.displayAvatarURL({ size: 2048, dynamic: true });
	const formats: AllowedImageFormat[] = ['webp', 'png', 'jpg', 'jpeg'];
	if (mainUrl.includes('gif')) formats.push('gif');

	const sizes: ImageSize[] = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

	const embed = msg.client
		.newEmbed('INFO')
		.setTitle(`${user.username}'s Avatar`)
		.setImage(mainUrl)
		.setDescription(
			stripIndents`
			${formats.map(f => `[${f}](${user.displayAvatarURL({ size: 2048, format: f })})`).join(' | ')}
			${sizes.map(s => `[${s}](${user.displayAvatarURL({ size: s, dynamic: true })})`).join(' | ')}
			`
		);
	return msg.channel.send(embed);
};

export const command: Command = {
	aliases: ['av', 'pfp', 'userlogo', 'usericon', 'useravatar'],
	description: "See a user's avatar",
	usage: '[User] (Defaults to self)',
	args: 0,
	devOnly: false,
	guildOnly: false,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

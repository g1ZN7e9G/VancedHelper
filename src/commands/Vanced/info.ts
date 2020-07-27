import { Command, Message } from '../../Client';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

const embed = () => new MessageEmbed().setTimestamp().setColor('0D7DFF');
const pages = [
	embed()
		.setThumbnail('https://i.imgur.com/NYmMUq5.png')
		.setTitle('Downloading Videos')
		.setDescription(
			stripIndents`
				Downloading videos has never been and will never be a feature of Vanced. It led to the shutdown of many Youtube Mods in the past.
				[In some regions](https://support.google.com/youtube/answer/6141269?co=GENIE.Platform%3DAndroid&hl=en) however, downloading is free.

				For downloading, use a third party tool like [Ymusic](https://ymusic.io).`
		),
	embed()
		.setImage('https://i.imgur.com/IIJcQ4Z.png')
		.setThumbnail('https://i.imgur.com/6xeelhB.png')
		.setTitle("No, you won't get banned for using Vanced.")
		.setDescription(
			"No, Youtube's new ToS do not state that your account might be removed due to not being commercially available. In other words, Youtube will not ban you for using Adblock or Vanced.\n\n" +
				"However, you  use Vanced at your own discretion. Seeing as it is an unofficial client and as we can't predict what Youtube will do in the future, there's always a very slight risk, and we can't guarantee your account's safety."
		),
	embed()
		.setThumbnail('https://i.imgur.com/gvNSmzo.png')
		.setTitle('Casting to TV')
		.setDescription(
			"Casting to TV doesn't actually cast, it just makes your TV open its Youtube app and play the video there.\n" +
				'This means that casting to TV will use the standard Youtube player which has ads and lacks the Vanced modifications.\n' +
				"There's nothing Vanced can do about this and this is **not a bug**."
		)
];

const callback = async (msg: Message, args: string[]) => {
	let initPage = (args.length ? parseInt(args[0]) - 1 : 0) || 0;
	if (initPage > pages.length) initPage = 0;
	msg.client.pages.create(msg, pages, initPage);
};

export const command: Command = {
	aliases: [],
	description: '',
	usage: '[Page]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

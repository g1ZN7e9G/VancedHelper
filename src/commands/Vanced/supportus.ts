import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';
import { config } from '../../config/index';

const callback = async (msg: Message) => {
	const output = msg.client
		.newEmbed('INFO')
		.setThumbnail('https://i.imgur.com/mFkZnUB.png')
		.setTitle('How to support us')
		.setDescription(
			"Vanced does not take donations! This means, that any donation links you might find are fake!\n\nAs mentioned above, Vanced does not take donations, but there's other way to support us, that you can find below."
		)
		.addFields([
			{
				name: 'Nitro Boost',
				value: stripIndents`
					If you own a [Discord Nitro Subscription](https://discordapp.com/nitro), you can boost our Server, which will give us Perks like a custom invite link [(discord.gg/vanced)](https://discord.gg/vanced), a custom server banner, more emotes etc.
					You yourself will also get some Perks:
					- Youtube Vanced Beta
					- Custom role (and colour)`
			},
			{
				name: 'Adguard Referral Link',
				value: 'If you want a system-wide adblocker for your unrooted/rooted phone and or pc and mac, [get adguard here](https://vancedapp.com/adguard).'
			},
			{
				name: 'Brave Referral Link',
				value: 'If you are planning to download Brave Browser, [do it via our referral link](https://vancedapp.com/brave).'
			},
			{
				name: 'Do not ask unnecessary questions',
				value: `Before asking for support or reporting a bug, please see if your problem has a solution on our bot (${config.defaultPrefix}help) and use the discord search tool.\nThis way, 95% of the problems can be solved without us having to waste time on explaining the same thing over and over.`
			},
			{
				name: 'Be a nice member of our community',
				value:
					'If you like what we are doing, consider hanging out on our Discord or Telegram, chatting with other users, helping users with Vanced issues, etc.'
			}
		]);

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['donate', 'support', 'contribute'],
	description: 'Learn how to support us',
	usage: '',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

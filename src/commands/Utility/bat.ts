import { Command, Message } from '../../Client';
import emojis from '../../constants/emojis';
import { stripIndents } from 'common-tags';

const stonkify = (p: string) => {
	const i = parseInt(p, 10);
	if (i >= 25) return `${emojis.relax} ${p}%`;
	else if (i >= 5) return `${emojis.merchant} ${p}%`;
	else if (Math.sign(i) === 1) return `${emojis.stonks} ${p}%`;
	else if (i <= -25) return `${emojis.sad} ${p}%`;
	else if (i <= -5) return `${emojis.feels} ${p}%`;
	return `${emojis.stinks} ${p}%`;
};

const callback = async (msg: Message, args: string[]) => {
	const data = await msg.client.helpers.fetch(`https://coinlib.io/api/v1/coin?key=${msg.client.config.coinlibToken}&pref=EUR&symbol=BAT`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	if (args.length && Boolean(parseFloat(args[0]))) return msg.channel.send(`${(parseFloat(args[0]) * parseFloat(data.price)).toFixed(2)} EUR`);

	const output = msg.client
		.newEmbed('INFO')
		.setTitle(`${data.name as string} (${data.symbol as string})`)
		.setFooter('Powered by coinlib.io')
		.addFields([
			{
				name: 'EUR',
				value: `${parseFloat(data.price).toFixed(5)}€`,
				inline: true
			},
			{
				name: 'Price Change',
				value: stripIndents`
				\`1h\` - ${stonkify(data.delta_1h)}
				\`24h\` - ${stonkify(data.delta_24h)}
				\`7d\` - ${stonkify(data.delta_7d)}
				\`30d\` - ${stonkify(data.delta_30d)}`
			}
		]);

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: [],
	description: 'Check how many stonks we made today',
	usage: '[Amount to convert to €]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

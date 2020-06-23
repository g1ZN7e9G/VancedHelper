import { Command, Message } from '../../Client';
import emojis from '../../constants/emojis';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	const data = await msg.client.helpers.fetch(`https://coinlib.io/api/v1/coin?key=${msg.client.config.coinlibToken}&pref=EUR&symbol=BAT`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		}
	});

	console.log(data);
	if (args.length && !!parseFloat(args[0])) return msg.channel.send((parseFloat(args[0]) * parseFloat(data.price)).toFixed(2) + ' EUR');

	const output = msg.client
		.newEmbed('INFO')
		.setTitle(`${data.name} (${data.symbol})`)
		.setFooter('Powered by coinlib.io')
		.addFields([
			{
				name: 'EUR',
				value: parseFloat(data.price).toFixed(2) + '€',
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

const stonkify = (p: string) => {
	if (parseInt(p) >= 25) return `${emojis.relax} ${p}%`;
	else if (parseInt(p) >= 5) return `${emojis.merchant} ${p}%`;
	else if (Math.sign(parseInt(p)) === 1) return `${emojis.stonks} ${p}%`;
	else if (parseInt(p) <= -25) return `${emojis.sad} ${p}%`;
	else if (parseInt(p) <= -5) return `${emojis.feels} ${p}%`;
	else return `${emojis.stinks} ${p}%`;
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

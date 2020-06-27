import { Command, Message } from '../../Client';

const emojis = ['🔢', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

const callback = async (msg: Message, args: string[]) => {
	let quotes = await msg.client.database.quotes.find();

	if (!quotes.length) return msg.channel.send(`I wasn't able to find any quotes. Try adding some!`);
	if (args.some(a => a.toLowerCase() === 'self')) quotes = quotes.filter(q => q.stars.includes(msg.author.id));

	const topTen = quotes
		.sort((x, y) => x.stars.length - y.stars.length)
		.slice(Math.max(quotes.length - 10, 0))
		.reverse();

	const embeds = topTen.map(quote => {
		const user = msg.client.users.cache.get(quote.authorID);
		return msg.client
			.newEmbed('BASIC')
			.setTimestamp(quote.timestamp || undefined)
			.setThumbnail(user?.displayAvatarURL({ dynamic: true }) || quote.author.avatar)
			.setImage(quote.attachment!)
			.setTitle(user?.tag || quote.author.name)
			.setDescription(
				`${quote.content}\n\n[Jump to message](${quote.link})\n\n${msg.client.constants.emojis.star} ${quote.stars.length} | ID: ${quote.case}`
			);
	});
	embeds.unshift(
		msg.client
			.newEmbed('INFO')
			.setTitle('Starboard')
			.setDescription(`See the most upvoted quotes below! For more information, jump to the page via reactions.`)
			.addFields(
				topTen.map((q, i) => {
					return { name: `${emojis[i + 1]} Quote #${q.case} by ${q.author.name} (${q.stars.length}⭐)`, value: q.content.shorten(200) };
				})
			)
	);
	msg.client.pages.create(msg, embeds, 0, false, emojis.slice(0, embeds.length));
	return;
};

export const command: Command = {
	aliases: ['sb', 'topquotes', 'tq', 'quotelb'],
	description: 'See the top 10 quotes',
	usage: '[self] (if supplied, only show quotes you starred)',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

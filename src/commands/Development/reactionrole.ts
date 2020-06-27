import { Command, Message } from '../../Client';

const callback = async (msg: Message, args: string[]) => {
	const [messageID, emoji, ...roleResolvable] = args;

	if (!messageID.match(msg.client.constants.regex.snowflake)) return msg.channel.send(`${messageID} is not a valid message ID!`);

	let emojiID: string | undefined;
	if (emoji.match(msg.client.constants.regex.emotes)) {
		emojiID = emoji.match(/:(\d+)>/)?.[1];
	} else if (emoji.match(msg.client.constants.regex.emotes)) {
		emojiID = msg.client.emojis.cache.get(emoji)?.name;
	} else {
		return msg.channel.send(`${emoji} is not a valid emoji!`);
	}

	if (!emojiID) return msg.channel.send(`${emoji} is not a valid emoji!`);

	const channel = msg.mentions.channels.first() || msg.channel;
	if (channel.id !== msg.channel.id) roleResolvable.pop();

	const message = await channel.messages.fetch(messageID).catch(() => null);
	if (!message) return msg.channel.send('Message not found.');

	const role = await msg.client.helpers.getRole(msg, roleResolvable);
	if (!role) return;

	const entry =
		(await msg.client.database.reactionRoles.findOne({ messageID: message.id })) ||
		(await msg.client.database.reactionRoles.create({ messageID: message.id, channelID: channel.id, reactionRoles: [] }));

	if (entry.reactionRoles.some(r => r.emojiID === emojiID)) return msg.channel.send(`That emoji is already used for another reaction role!`);

	entry.reactionRoles.push({ emojiID: emojiID, roleID: role.id });
	entry.save();

	if (msg.client.emojis.cache.has(emojiID)) message.react(emojiID).catch(() => null);

	return msg.channel.send(`Done! Users will now get the role \`${role.name}\` upon reaction with the provided reaction.`);
};

export const command: Command = {
	aliases: ['rr'],
	description: 'Add reaction roles',
	usage: '<MessageID> <Emoji> <Role> [#Channel (defaults to current channel)]',
	devOnly: true,
	guildOnly: true,
	args: 3,
	memberPermission: [],
	botPermission: ['MANAGE_ROLES'],
	callback: callback
};

import { Client, Message } from '../Client';
import { stripIndents } from 'common-tags';
import { TextChannel } from 'discord.js';

export default async (client: Client, msg: Message) => {
	// No bots
	if (msg.author.bot) return;

	// Fetch partials (uncached messages)
	if (msg.partial) msg = (await msg.fetch().catch(() => null)) as Message;
	if (!msg) return;

	// Make sure I have access to channel
	if (msg.client.helpers.missingPermissions(msg, ['SEND_MESSAGES', 'VIEW_CHANNEL'], 'self')) return;

	// Detect message links and embed them
	const [, channelID, messageID] = msg.content.match(/^https:\/\/discord(?:app)?.com\/channels\/\d+\/(\d+)\/(\d+)$/) || [];
	if (channelID && msg.guild) {
		const channel = msg.guild.channels.cache.get(channelID);
		if (!channel || !(channel instanceof TextChannel)) return;

		const message = await channel.messages.fetch(messageID).catch(_ => null);
		if (!message) return;

		const embed = msg.client
			.newEmbed('INFO')
			.setTitle(message.author.tag)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setDescription(`${message.content}\n\n[Jump to message](${msg.content})`);

		const attachment = message.attachments.first()?.url;
		if (attachment && msg.client.helpers.isImageUrl(attachment)) embed.setImage(attachment);

		return msg.channel.send(embed);
	}

	// Check prefix
	const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${msg.client.config.defaultPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

	const matched = msg.content.match(prefixRegex);
	const prefix = matched?.[0] || null;
	if ((!prefix && msg.guild) || (prefix && !msg.content.startsWith(prefix))) return;

	// If pinged without further content, return basic info
	if (!msg.content.replace(new RegExp(`<@!?${client.user!.id}>`), '').length)
		return msg.channel.send(stripIndents`
		My prefix is \`${msg.client.config.defaultPrefix}\`
		For a list of commands, type \`${msg.client.config.defaultPrefix}help\``);

	let args = msg.content
		.slice(prefix?.length || 0)
		.trim()
		.split(/ +/);

	let commandName = args.shift();
	if (!commandName) return;

	if (args.length === 1 && args[0].toLowerCase() === 'help') {
		args = [commandName];
		commandName = 'help';
	}

	const command = client.getCommand(commandName);
	if (!command) return;

	// Allow developers to add the flag --force to the end of their message to bypass all checks
	const force = msg.client.config.developers.includes(msg.author.id) && args[args.length - 1] === '--force';
	if (force) args.pop();

	if (!force) {
		// Prohibit dev only commands from members
		if (command.devOnly && !msg.client.config.developers.includes(msg.author.id)) return;

		// Make sure they don't have an active command already
		if (msg.client.activeCommands.has(msg.author.id)) return msg.channel.send('Please complete your current command before using a new one!');

		// Check whether we're on a guild if command is guild only
		if (command.guildOnly && !msg.guild) return msg.channel.send(`\`${prefix}${command.name}\` can only be used on a server!`);

		// Get missing permisisons of bots and members and output an error if some are missing
		const memberMissing = command.memberPermission ? msg.client.helpers.missingPermissions(msg, command.memberPermission) : null;
		const botMissing = command.botPermission ? msg.client.helpers.missingPermissions(msg, command.botPermission, 'self') : null;

		if (memberMissing)
			return msg.channel.send(`You require the following permissions to use this command: ${memberMissing.map(ele => ele.toTitleCase()).join(', ')}`);

		if (botMissing)
			return msg.channel.send(`I require the following permissions to run this command: ${botMissing.map(ele => ele.toTitleCase()).join(', ')}`);

		// Make sure enough args are provided
		if (args.length < command.args)
			return msg.channel.send(
				`This command requires ${command.args} arguments, but you only provided ${args.length}.\nPlease try again: \`${prefix}${command.name} ${command.usage}\``
			);

		// Rate limiting
		const cooldown = msg.client.cooldowns.get(msg.author, command);
		if (cooldown) return msg.channel.send(`Calm down bro ${msg.client.bruh}\n\`${cooldown.toFixed(1)}\`s remaining.`);

		msg.client.activeCommands.add(msg.author.id);
	}

	// Execute the command and emit useful events
	return command
		.callback(msg, args)
		.then(res => client.emit('commandUsed', msg, command, res))
		.catch(err => client.emit('commandFailed', msg, command, err));
};

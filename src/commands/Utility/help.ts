import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	const dev = msg.client.config.developers.includes(msg.author.id);
	const prefix = msg.client.config.defaultPrefix;

	if (args.length) {
		const command = msg.client.getCommand(args.join('').toLowerCase());
		if (!command) return msg.channel.send(`That's not a valid command ${msg.client.bruh}`);

		if (command.devOnly && !dev) return;

		const emojis = msg.client.constants.emojis;

		const output = msg.client
			.newEmbed('INFO')
			.setTitle(prefix + command.name)
			.addFields([
				{ name: 'Description', value: command.description || 'No description provided' },
				{
					name: 'Usage',
					value: `${prefix}${command.name}${command.usage ? ` ${command.usage}` : ''}`.toCodeblock('css')
				},
				{ name: 'Aliases', value: command.aliases.join(', ') || `${command.name} has no aliases.` }
			])
			.setDescription(
				stripIndents`
				Cooldown: ${command.cooldown ? `\`${command.cooldown}s\`` : emojis.fail}
				Guild only: ${command.guildOnly ? emojis.success : emojis.fail}
				Requires arguments: ${command.args || emojis.fail}
				Requires Permissions: ${command.memberPermission.length ? command.memberPermission.map(p => p.toTitleCase()).join(', ') : emojis.fail}
		`
			);

		return msg.channel.send(output);
	}

	const commands: Record<string, Array<string>> = {};

	msg.client.commands.forEach(cmd => {
		if ((cmd.devOnly && !dev) || cmd.hidden) return;

		if (!(commands[cmd.category] as null | string[])) commands[cmd.category] = [];
		commands[cmd.category].push(`\`${prefix}${cmd.name}\` - ${cmd.description || 'No description provided'}`);
	});

	const output = msg.client
		.newEmbed('INFO')
		.setTitle('Help Menu')
		.setDescription(`For more info on a specific command, type \`${prefix}help command\`!`)
		.addFields(Object.keys(commands).map(key => ({ name: key, value: commands[key].join('\n') })));

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['h', 'helpme'],
	description: '',
	usage: 'You are here ;)',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

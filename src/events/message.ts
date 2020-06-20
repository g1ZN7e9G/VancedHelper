import { Client, Message } from '../Client';
import { stripIndents } from 'common-tags';

export default async (client: Client, msg: Message) => {
	if (msg.author.bot) return;

	if (msg.partial) msg = (await msg.fetch().catch(() => null)) as Message;
	if (!msg) return;

	const prefixRegex = new RegExp(`^(<@!?${client.user!.id}>|${msg.client.config.defaultPrefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);

	const matched = msg.content.match(prefixRegex);
	const prefix = matched?.[0] || null;
	if ((!prefix && msg.guild) || (prefix && !msg.content.startsWith(prefix))) return;

	if (!msg.content.replace(new RegExp(`<@!?${client.user!.id}>`), '').length)
		return msg.channel.send(stripIndents`
		My prefix is \`${msg.client.config.defaultPrefix}\`
		For a list of commands, type \`${msg.client.config.defaultPrefix}help\``);

	const args = msg.content
		.slice(prefix?.length || 0)
		.trim()
		.split(/ +/);

	const commandName = args.shift();
	if (!commandName) return;

	const command = client.getCommand(commandName);
	if (!command) return;

	if (args.length === 1 && args[0].toLowerCase() === 'help')
		return client
			.getCommand('help')!
			.callback(msg, [command.name])
			.catch(err => client.handleError(err, msg));

	command
		.callback(msg, args)
		.then(res => client.emit('commandUsed', msg, command, res))
		.catch(err => client.emit('commandFailed', msg, command, err));
};

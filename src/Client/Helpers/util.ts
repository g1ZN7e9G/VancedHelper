import { Message, Client } from '..';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PermissionString, GuildMember, Message as BaseMessage, GuildChannel, Role, User, Collection } from 'discord.js';
import { GuildMessage } from '../Interfaces/Message';

export class Util {
	constructor(client: Client) {
		this.client = client;
	}
	client: Client;

	async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(requestInfo, requestOptions)
				.then(async res => {
					if (res.status > 299 || res.status < 200) reject(`${res.status} | ${res.statusText}`);

					try {
						const contentType = res.headers.get('content-type') || 'application/json';

						let result;
						if (contentType.includes('image')) result = await res.buffer();
						else if (contentType.includes('text')) result = await res.text();
						else result = await res.json();
						resolve(result);
					} catch (error) {
						reject(error);
					}
				})
				.catch(reject);
		});
	}

	async uploadHaste(text: string) {
		const init: RequestInit = {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: text,
				redirect: 'follow',
				timeout: 3000
			},
			urls = ['https://hasteb.in/', 'https://hastebin.com/'];
		let url: string | null = urls[0];

		const res =
			(await this.fetch(url + 'documents', init).catch(() => {
				url = urls[1];
				return null;
			})) ||
			(await this.fetch(url + 'documents', init).catch(() => {
				url = null;
				return null;
			}));

		return url && res && res.key ? url + res.key : 'Failed to upload to hastebin';
	}

	missingPermissions(identifier: Message | GuildChannel, permissions: PermissionString[], member?: GuildMember | 'self') {
		const author = identifier instanceof BaseMessage ? identifier.member! : null;
		if (identifier instanceof BaseMessage) {
			if (identifier.channel instanceof GuildChannel) identifier = identifier.channel;
			else return;
		}
		const targetMember = member === 'self' ? identifier.guild.me! : member || author || identifier.guild.me!;
		const allPermissions = identifier.permissionsFor(targetMember) || targetMember.permissions;
		const missing = permissions.filter(p => !allPermissions?.has(p));
		return missing.length ? missing : undefined;
	}

	numToMonth(num: number) {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
	}

	isImageUrl(str: string) {
		return this.client.constants.regex.links.test(str) && str.match(/.(png|jpe?g|gif|web[pm])(?:\?.*)?$/i) !== null;
	}
	msToHuman(ms: number) {
		const seconds = Math.round(ms / 1000),
			minutes = Math.round(ms / (1000 * 60)),
			hours = Math.round(ms / (1000 * 60 * 60)),
			days = Math.round(ms / (1000 * 60 * 60 * 24));

		if (seconds < 60) return seconds + ' Seconds';
		else if (minutes < 60) return minutes + ' Minutes';
		else if (hours < 24) return hours + ' Hours';
		else return days + ' Days';
	}

	isGuild(msg: Message | BaseMessage): msg is GuildMessage {
		return !!msg.guild;
	}

	isMemberHigher(executor: GuildMember, target: GuildMember) {
		return (
			(executor.id !== target.id && executor.guild.ownerID === executor.id) ||
			(target.guild.ownerID !== target.id && executor.roles.highest.position > target.roles.highest.position)
		);
	}

	async getUser(message: Message, args: string[], spot?: number) {
		if (message.guild) {
			const member = await this.getMember(message, args);
			return member ? member.user : void 0;
		}

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const user = message.mentions.users?.first() || (await message.client.users.fetch(input).catch(() => null));
		if (user) return user;

		const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

		if (userSearch.size === 0) {
			message.channel.send('You did not provide a valid user. Please run the command again and provide one.');
		} else if (userSearch.size === 1) {
			return userSearch.first();
		} else if (userSearch.size < 11) {
			return await this.chooseOne(message, userSearch);
		} else {
			message.channel.send(`I found multiple users matching your input: ${userSearch.size}`);
		}
	}

	async getMember(message: Message, args: string[], spot?: number) {
		if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

		const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const member = message.mentions.members?.first() || (await message.guild.members.fetch(input).catch(() => null));
		if (member) return member;

		const memberSearch = message.guild.members.cache.filter(
			member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
		);

		if (memberSearch.size === 0) {
			message.channel.send('You did not provide a valid member. Please run the command again and provide one.');
		} else if (memberSearch.size === 1) {
			return memberSearch.first();
		} else if (memberSearch.size < 11) {
			return await this.chooseOne(message, memberSearch);
		} else {
			message.channel.send(`I found multiple users matching your input: ${memberSearch.size}`);
		}
	}

	async getRole(message: Message, args: string[], spot?: number) {
		if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const role = message.mentions.roles?.first() || message.guild.roles.cache.get(input);
		if (role) return role;

		const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

		if (roleSearch.size === 0) {
			message.channel.send('You did not provide a valid role. Please run the command again and provide one.');
		} else if (roleSearch.size === 1) {
			return roleSearch.first();
		} else if (roleSearch.size < 11) {
			return await this.chooseOne(message, roleSearch);
		} else {
			message.channel.send(`I found multiple roles matching your input: ${roleSearch.size}`);
		}
	}

	getName = (thing: Role | User | GuildMember) => (thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag);

	private chooseOne(message: Message, choices: Collection<string, Role>): Promise<Role | void>;
	private chooseOne(message: Message, choices: Collection<string, User>): Promise<User | void>;
	private chooseOne(message: Message, choices: Collection<string, GuildMember>): Promise<GuildMember | void>;
	private async chooseOne(message: Message, choices: Collection<string, Role | User | GuildMember>) {
		const options = choices.array().map((c, i) => {
			return { index: i + 1, choice: c };
		});

		const prompt = new this.client.prompt(message);
		const choice = await prompt.message(
			'I found multiple targets. Please select one from below by typing only the number!' +
				options
					.map(o => `${o.index} | ${this.getName(o.choice)}`)
					.join('\n')
					.toCodeblock('css'),
			options.map(o => o.index.toString()),
			'That was not a valid option! Please try again.'
		);
		prompt.delete();

		if (!choice) {
			message.channel.send('I found multiple matches but the prompt to select one ran out. Please run the command again!');
			return choice;
		}

		const result = options.find(o => o.index === parseInt(choice));
		if (!result) return;

		return result.choice;
	}
}

import { Message, Client } from '..';
import fetch, { RequestInfo, RequestInit } from 'node-fetch';
import { PermissionString, GuildMember, Message as BaseMessage, GuildChannel, Role, User, Collection, TextChannel } from 'discord.js';
import { GuildMessage } from '../Interfaces/Message';

export class Util {
	private readonly client: Client;
	public constructor(client: Client) {
		this.client = client;
	}

	public async fetch(requestInfo: RequestInfo, requestOptions?: RequestInit): Promise<any> {
		return new Promise((resolve, reject) => {
			fetch(requestInfo, requestOptions)
				.then(async res => {
					if (res.status > 299 || res.status < 200) reject(`${res.status} | ${res.statusText}`);

					try {
						const contentType = res.headers.get('content-type') ?? 'application/json';

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

	public async wait(seconds: number) {
		return new Promise(resolve => setTimeout(resolve, seconds * 1000));
	}

	public async uploadHaste(text: string) {
		const init: RequestInit = {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: text,
			redirect: 'follow',
			timeout: 3000
		};
		const urls = ['https://hasteb.in/', 'https://hastebin.com/'];
		let url: string | null = urls[0];

		const res =
			(await this.fetch(`${url}documents`, init).catch(() => {
				url = urls[1];
				return null;
			})) ||
			(await this.fetch(`${url}documents`, init).catch(() => {
				url = null;
				return null;
			}));

		return url && res && res.key ? `${url}${res.key as string}` : 'Failed to upload to hastebin';
	}

	public missingPermissions(identifier: Message | GuildChannel, permissions: PermissionString[], member?: GuildMember | 'self') {
		const author = identifier instanceof BaseMessage ? identifier.member! : null;
		if (identifier instanceof BaseMessage) {
			if (identifier.channel instanceof GuildChannel) identifier = identifier.channel;
			else return;
		}
		const targetMember = member === 'self' ? identifier.guild.me! : member ?? author ?? identifier.guild.me!;
		const allPermissions = identifier.permissionsFor(targetMember) ?? targetMember.permissions;
		const missing = permissions.filter(p => !allPermissions.has(p));
		return missing.length ? missing : undefined;
	}

	public numToMonth(num: number) {
		return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][num];
	}

	public isImageUrl(str: string) {
		return this.client.constants.regex.links.test(str) && Boolean(/.(png|jpe?g|gif|web[pm])(?:\?.*)?$/i.exec(str));
	}

	public msToHuman(ms: number) {
		const seconds = Math.round(ms / 1000);
		const minutes = Math.round(ms / (1000 * 60));
		const hours = Math.round(ms / (1000 * 60 * 60));
		const days = Math.round(ms / (1000 * 60 * 60 * 24));

		if (seconds < 60) return `${seconds} Seconds`;
		else if (minutes < 60) return `${minutes} Minutes`;
		else if (hours < 24) return `${hours} Hours`;
		return `${days}  Days`;
	}

	public isGuild(msg: Message | BaseMessage): msg is GuildMessage {
		return Boolean(msg.guild);
	}

	public isMemberHigher(executor: GuildMember, target: GuildMember) {
		return (
			(executor.id !== target.id && executor.guild.ownerID === executor.id) ||
			(target.guild.ownerID !== target.id && executor.roles.highest.position > target.roles.highest.position)
		);
	}

	private readonly timeUnits = {
		s: 1000,
		m: 1000 * 60,
		h: 1000 * 60 * 60,
		d: 1000 * 60 * 60 * 24,
		w: 1000 * 60 * 60 * 24 * 7
	};

	public parseTimeString(str: string) {
		const matches = str.match(/\d+[wdhms]/gi);
		if (!matches || !matches.length) return null;

		let duration = 0;

		for (const match of matches) duration += parseInt(match.substring(0, match.length - 1), 10) * this.timeUnits[match.charAt(match.length - 1) as 's'];

		return {
			matches,
			duration
		};
	}

	public async giveRole(msg: Message | null, member: GuildMember, role: Role, take = false) {
		const success = await member.roles[take ? 'remove' : 'add'](role).catch(() => false);
		if (!success) {
			void msg?.channel.send('Sorry, something went wrong!');
			return false;
		}
		return true;
	}

	public async createInfraction(
		msg: GuildMessage,
		logChannel: TextChannel,
		role: Role,
		action: 'MUTE' | 'UNMUTE' | 'SPAM' | 'UNSPAM',
		member: GuildMember,
		moderator: User,
		reason = 'No reason provided',
		duration = 0
	) {
		const embed = this.client.newEmbed('INFO').addFields([
			{
				name: 'User',
				value: `${member.toString()} - ${member.user.tag} (${member.id})}`
			},
			{
				name: 'Moderator',
				value: `${moderator.toString()} - ${moderator.tag} (${moderator.id}})`
			},
			{
				name: 'Reason',
				value: reason
			}
		]);
		if (action === 'MUTE' || action === 'SPAM') {
			if (!(await this.giveRole(msg, member, role))) return;
			if (duration) {
				const entry = await this.client.database.infractions.create({
					userID: member.id,
					guildID: msg.guild.id,
					infractionType: action,
					end: Date.now() + duration
				});
				setTimeout(() => {
					void this.client.database.infractions
						.findById(entry.id)
						.then(e =>
							e
								? void this.createInfraction(
										msg,
										logChannel,
										role,
										action === 'MUTE' ? 'UNMUTE' : 'UNSPAM',
										member,
										this.client.user!,
										'Punishment duration over!'
								  )
								: void 0
						);
				}, duration);
			}
		} else {
			if (!(await this.giveRole(msg, member, role, true))) return;
			void this.client.database.infractions.findOneAndDelete({ userID: member.id });
		}

		switch (action) {
			case 'MUTE':
				embed.setTitle(`Muted ${member.user.tag}`);
				break;
			case 'UNMUTE':
				embed.setTitle(`Unmuted ${member.user.tag}`);
				break;
			case 'SPAM':
				embed.setTitle(`${member.user.tag} is now a spammer`);
				break;
			case 'UNSPAM':
				embed.setTitle(`${member.user.tag} is no longer a spammer`);
				break;
		}

		if (reason !== 'Punishment duration over!') await msg.channel.send(embed.title!);
		await logChannel.send(embed);

		switch (action) {
			case 'MUTE':
				embed.setTitle(`You have been muted!`);
				break;
			case 'UNMUTE':
				embed.setTitle('You have been unmuted!');
				break;
			case 'SPAM':
				embed.setTitle(`You have been given the spammer role!`);
				break;
			case 'UNSPAM':
				embed.setTitle(`You have been removed from the spammer role!`);
				break;
		}

		member.send(embed).catch(() => null);
	}

	public async getUser(message: Message, args: string[], spot?: number) {
		if (message.guild) {
			const member = await this.getMember(message, args);
			return member ? member.user : void 0;
		}

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const user = message.mentions.users.first() ?? (await message.client.users.fetch(input).catch(() => null));
		if (user) return user;

		const userSearch = message.client.users.cache.filter(user => user.tag.toLowerCase().includes(input));

		if (userSearch.size === 0) {
			void message.channel.send('You did not provide a valid user. Please run the command again and provide one.');
		} else if (userSearch.size === 1) {
			return userSearch.first();
		} else if (userSearch.size < 11) {
			return this.chooseOne(message, userSearch);
		} else {
			void message.channel.send(`I found multiple users matching your input: ${userSearch.size}`);
		}
	}

	public async getMember(message: Message, args: string[], spot?: number) {
		if (!message.guild) throw new SyntaxError('getMember was used in a DmChannel.');

		const input = spot || spot === 0 ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const member = message.mentions.members?.first() ?? (await message.guild.members.fetch(input).catch(() => null));
		if (member) return member;

		const memberSearch = message.guild.members.cache.filter(
			member => member.displayName.toLowerCase().includes(input) || member.user.tag.toLowerCase().includes(input)
		);

		if (memberSearch.size === 0) {
			void message.channel.send('You did not provide a valid member. Please run the command again and provide one.');
		} else if (memberSearch.size === 1) {
			return memberSearch.first();
		} else if (memberSearch.size < 11) {
			return this.chooseOne(message, memberSearch);
		} else {
			void message.channel.send(`I found multiple users matching your input: ${memberSearch.size}`);
		}
	}

	public async getRole(message: Message, args: string[], spot?: number) {
		if (!message.guild) throw new SyntaxError('getRole was used in a DmChannel.');

		const input = spot ? args[spot].toLowerCase() : args.join(' ').toLowerCase();

		const role = message.mentions.roles.first() ?? message.guild.roles.cache.get(input);
		if (role) return role;

		const roleSearch = message.guild.roles.cache.filter(role => role.name.toLowerCase().includes(input));

		if (roleSearch.size === 0) {
			void message.channel.send('You did not provide a valid role. Please run the command again and provide one.');
		} else if (roleSearch.size === 1) {
			return roleSearch.first();
		} else if (roleSearch.size < 11) {
			return this.chooseOne(message, roleSearch);
		} else {
			void message.channel.send(`I found multiple roles matching your input: ${roleSearch.size}`);
		}
	}

	private getName(thing: Role | User | GuildMember) {
		return thing instanceof Role ? thing.name : thing instanceof User ? thing.tag : thing.user.tag;
	}

	private chooseOne(message: Message, choices: Collection<string, Role>): Promise<Role | void>;
	private chooseOne(message: Message, choices: Collection<string, User>): Promise<User | void>;
	private chooseOne(message: Message, choices: Collection<string, GuildMember>): Promise<GuildMember | void>;
	private async chooseOne(message: Message, choices: Collection<string, Role | User | GuildMember>) {
		const options = choices.array().map((c, i) => {
			return { index: i + 1, choice: c };
		});

		const prompt = new this.client.prompt(message);
		const choice = await prompt.message(
			`I found multiple targets. Please select one from below by typing only the number!\n
				${options
					.map(o => `${o.index} | ${this.getName(o.choice)}`)
					.join('\n')
					.toCodeblock('css')}`,
			options.map(o => o.index.toString()),
			'That was not a valid option! Please try again.'
		);
		prompt.delete();

		if (!choice) {
			void message.channel.send('I found multiple matches but the prompt to select one ran out. Please run the command again!');
			return choice;
		}

		const result = options.find(o => o.index === parseInt(choice, 10));
		if (!result) return;

		return result.choice;
	}
}

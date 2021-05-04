/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
import { Client as BaseClient, Collection, MessageEmbed, TextChannel } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { FullCommand, ClientOptions, Message, ClientEvents } from './Interfaces';
import { stripIndents } from 'common-tags';
import { config } from '../config';
import { database } from '../database/';
import { Pagination, PromptManager, Util, Cooldowns, Music } from './Helpers';
import constants from '../constants';
export * from './Interfaces';

export class Client extends BaseClient {
	private readonly _on = this.on;
	private readonly _emit = this.emit;
	public on = <K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void): this => this._on(event, listener);
	public emit = <K extends keyof ClientEvents>(event: K, ...args: ClientEvents[K]): boolean => this._emit(event, ...args);

	public commands: Collection<string, FullCommand> = new Collection();
	public activeCommands: Set<string> = new Set();
	public music = new Music(this);
	public pages = Pagination;
	public prompt = PromptManager;
	public cooldowns = Cooldowns;
	public helpers = new Util(this);
	public config = config;
	public constants = constants;
	public database = database;
	public paths = {
		listeners: join(__dirname, '../events'),
		commands: join(__dirname, '../commands')
	};

	public settings = {
		debug: false,
		flushTime: 1000 * 60 * 30,
		promptTimeout: 3, // In minutes
		commandCooldown: 3, // In seconds
		colours: {
			ERROR: 'FF403C',
			INFO: '0D7DFF',
			BASIC: '75F1BD'
		}
	};

	public constructor(options?: ClientOptions) {
		super(options?.baseOptions);
		this.settings = { ...this.settings, ...options };
	}

	public start() {
		this.initCommands();
		this.initListeners();
		void this.login(this.config.token);
	}

	/**
	 * Get a random emote in the case of a bruh moment
	 */
	public get bruh() {
		return this.constants.emojis.bruh.random();
	}

	public newEmbed(type?: 'INFO' | 'ERROR' | 'BASIC') {
		return new MessageEmbed().setColor(type ? this.settings.colours[type] : 'RANDOM');
	}

	public initCommands() {
		let amount = 0;
		readdirSync(this.paths.commands).forEach(dir => {
			readdirSync(join(this.paths.commands, dir)).forEach(file => {
				const path = join(this.paths.commands, dir, file);
				const command: FullCommand = require(path).command;
				command.name = file.replace('.js', '');
				command.category = dir as any;

				const alreadyTaken = this.commands.find(
					cmd =>
						cmd.name === command.name ||
						cmd.aliases.includes(command.name) ||
						command.aliases.includes(cmd.name) ||
						command.aliases.some(alias => cmd.aliases.includes(alias))
				);
				if (alreadyTaken) {
					console.error(`A name or alias in file ${path} is already taken by the ${alreadyTaken.name} command!`);
					process.exit(1);
				}

				if (!command.cooldown) command.cooldown = this.settings.commandCooldown;

				this.commands.set(command.name, command);
				delete require.cache[path];
				amount++;
			});
		});
		console.log(`Loaded ${amount} commands!`);
	}

	public initListeners() {
		let amount = 0;
		readdirSync(this.paths.listeners).forEach(file => {
			const path = join(this.paths.listeners, file);
			const listener = require(path).default;
			const listenerName = file.replace('.js', '');
			this.on(listenerName as any, listener.bind(null, this));
			delete require.cache[path];
			amount++;
		});
		this.on('error', err => void this.handleError(err));
		console.log(`Loaded ${amount} listeners!`);
	}

	public getCommand(commandName: string) {
		return this.commands.get(commandName) ?? this.commands.find(cmd => cmd.aliases.includes(commandName));
	}

	public getChannel(channelType: 'info' | 'errors' | 'boosters' | 'testers') {
		const channel = this.channels.cache.get(this.config.channels[channelType]);
		if (!channel || !(channel instanceof TextChannel)) {
			console.log(`Invalid ${channelType}-channel provided or not reachable.`);
			process.exit(1);
		}
		return channel;
	}

	public getDevelopers() {
		return Promise.all(this.config.developers.map(d => this.users.fetch(d)));
	}

	public handleError = async (err: Error, message?: Message) => {
		console.error(err);

		const channel = this.getChannel('errors');

		const errorEmbed = new MessageEmbed()
			.setColor(this.settings.colours.ERROR)
			.setTitle(err.name)
			.setDescription((err.stack ?? 'No Error.').shorten(2000).toCodeblock());
		if (message) {
			errorEmbed.addFields([
				{ name: 'Message', value: (message.content || 'Empty message').shorten(1024) },
				{
					name: 'Message Info',
					value: stripIndents`
                Guild: ${message.guild ? `${message.guild.name} (${message.guild.id})` : '-'}
                Author: ${message.author.tag} (${message.author.id})`
				}
			]);
			void message.reply(
				new MessageEmbed()
					.setColor(this.settings.colours.ERROR)
					.setDescription(
						'Sadly, an internal error occurred. There is no need to report this, as all errors will automatically notify my developers!'
					)
			);
		}
		return channel.send((await Promise.all(this.config.developers.map(d => this.users.fetch(d)))).join(' '), errorEmbed);
	};
}

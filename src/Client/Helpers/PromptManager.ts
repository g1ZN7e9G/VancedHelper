import { Client, Message } from '..';
import { TextChannel, DMChannel, NewsChannel, User, MessageEmbed, GuildEmoji, ReactionEmoji } from 'discord.js';

export class PromptManager {
	private static readonly prompts: Set<string> = new Set();
	private readonly client: Client;
	private readonly channel: TextChannel | NewsChannel | DMChannel;
	private readonly user: User;
	private readonly trigger: Message;
	private msg?: Message;
	private readonly embed: MessageEmbed;

	public constructor(msg: Message) {
		this.client = msg.client;
		this.trigger = msg;
		this.channel = msg.channel;
		this.user = msg.author;
		this.embed = msg.client
			.newEmbed('BASIC')
			.setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
			.setFooter('Type quit to cancel anytime.');
	}

	private async sendQuestion(question: string) {
		if (!this.msg) this.msg = (await this.channel.send(this.embed.setDescription(question))) as Message;

		this.msg.edit(this.embed.setDescription(question)).catch(() => null);
	}

	/**
	 * Delete the prompt
	 */
	public delete() {
		PromptManager.prompts.delete(this.user.id);
		if (this.msg?.deletable) void this.msg.delete();
	}

	/**
	 * Prompts for user input
	 * @param question The Question to send.
	 * @param options An array of accepted choices or a RegEx. Provide an empty array if anything is accepted
	 * @param error A custom error message when invalid input is provided. `{VALUE}` will be replaced with their invalid choice
	 * @param timeout The prompt timeout (in min)
	 * @returns The user choice (string)
	 */
	public async message(
		question: string,
		options: string[] | RegExp,
		error?: string,
		timeout = this.client.settings.promptTimeout,
		initial = true
	): Promise<string | void> {
		if (PromptManager.prompts.has(this.user.id)) {
			void this.trigger.channel.send('You already have another prompt open!');
			return;
		}
		PromptManager.prompts.add(this.user.id);

		if (initial) void this.sendQuestion(question);

		const input = (await this.channel.awaitMessages((msg: Message) => msg.author.id === this.user.id, { max: 1, time: 1000 * 60 * timeout })).first();

		PromptManager.prompts.delete(this.user.id);

		if (!input) {
			this.delete();
			void this.trigger.channel.send('The prompt timed out!');
			return;
		}

		if (input.deletable) input.delete({ timeout: 1000 }).catch(() => null);

		if ('quit'.startsWith(input.content.toLowerCase())) {
			void this.trigger.channel.send('Successfully cancelled the prompt!');
			return;
		}

		if (options instanceof RegExp && options.test(input.content)) return input.content;
		else if (options instanceof Array && (!options.length || options.includes(input.content))) return input.content;

		void this.sendQuestion(
			`${error?.substitute({ VALUE: input.content }) ?? `\`${input.content}\` is not a valid choice! Please try again.`}\n\n${question}`
		);
		return this.message(question, options, error, timeout, false);
	}

	/**
	 * @param question The Question to send
	 * @param options An array of accepted choices or a RegEx. Provide an empty array if anything is accepted
	 * @param react Whether to react with all options (Only works if options is array)
	 * @param error A custom error message when invalid input is provided
	 * @param timeout The prompt timeout (in min)
	 * @returns The user choice (emoji object)
	 */
	public async reaction(
		question: string,
		options: string[] | RegExp,
		react?: boolean,
		error?: string,
		timeout = this.client.settings.promptTimeout,
		initial = true
	): Promise<GuildEmoji | ReactionEmoji | void> {
		if (PromptManager.prompts.has(this.user.id)) {
			void this.trigger.channel.send('You already have another prompt open!');
			return;
		}
		PromptManager.prompts.add(this.user.id);

		if (initial) await this.sendQuestion(question);
		if (react && options instanceof Array) await Promise.all(options.map(r => this.msg?.react(r)));

		const input = (await this.msg!.awaitReactions((_, u: User) => u.id === this.user.id, { max: 1, time: 1000 * 60 * timeout })).first();

		PromptManager.prompts.delete(this.user.id);

		if (!input) {
			this.delete();
			void this.trigger.channel.send('The prompt timed out!');
			return;
		}

		if (options instanceof RegExp && options.test(input.emoji.name)) return input.emoji;
		else if (options instanceof Array && (!options.length || options.includes(input.emoji.id ?? input.emoji.name))) return input.emoji;

		void this.sendQuestion(`${error ?? `That is not a valid choice! Please try again.`}\n\n${question}`);
		return this.reaction(question, options, react, error, timeout, false);
	}

	public async chooseOne<T>(question: string, choices: Array<T>): Promise<T | void> {
		const choice = await this.message(
			question +
				choices
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					.map((c, i) => `${i + 1} | ${c}`)
					.join('\n')
					.toCodeblock('css'),
			choices.map((_, i) => (i + 1).toString()),
			'`{VALUE}` is not a valid option! Please try again.'
		);

		if (!choice) return;

		const result = choices[parseInt(choice, 10) - 1];
		return result;
	}
}

import { Message } from '..';
import { Collection, MessageEmbed, MessageReaction, User } from 'discord.js';
import { stripIndents } from 'common-tags';

export const Pagination = {
	/**
	 * A collection of all messages requiring pagination, mapped by their messageID
	 */
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
	pages: new Collection() as Collection<string, Page>,
	defaultEmojis: ['⏮️', '⬅️', '⏹️', '➡️', '⏭️'],
	/**
	 * Create a multi page embed
	 * @param message The message that called the command that initialises this. **This will automatically send the first page as message!**
	 * @param embeds An Array of all embeds. A footer displaying the current page will be added to all embeds
	 * @param initPage If this is supplied, send this page instead of the first page
	 * @param customEmojis If this is supplied, use these emojis for pagination instead. Must have same length as the embed array! **Must be only the id (or name for unicode)!**
	 */
	async create(message: Message, embeds: Array<MessageEmbed>, initPage = 0, addIndex = true, customEmojis?: Array<string>) {
		// Make a copy of the array so we don't overwrite the original one
		embeds = [...embeds];
		if (embeds.length < 2) throw new Error('Too little pages provided!');
		if (embeds.length < initPage) throw new Error('InitPage out of range!');
		if (customEmojis && customEmojis.length !== embeds.length) throw new Error(`${customEmojis.length} emojis but ${embeds.length} pages provided!`);

		if (addIndex)
			embeds.unshift(
				new MessageEmbed().setTitle('Index').setDescription(
					stripIndents`
						Review the table of contents below and jump to the page you need via reactions
						${`${customEmojis ? customEmojis[0] : 1} | You are here ;)\n${embeds
							.map((e, i) => `${customEmojis ? customEmojis[i + 1] : i + 2} | ${e.title!}`)
							.join('\n')}`.toCodeblock()}`
				)
			);
		embeds.forEach((e, i) => e.setFooter(`Page ${i + 1}/${embeds.length}`));

		const msg = (await message.channel.send(`${message.client.constants.emojis.loading}`, embeds[initPage])) as Message;
		const success = await Promise.all((customEmojis ?? this.defaultEmojis).map(r => msg.react(r)))
			.then(() => msg.edit(embeds[initPage]).catch(() => null))
			.catch(() => null);

		if (!success) {
			msg.delete().catch(() => null);
			void message.channel.send('Sorry, something went wrong and I was not able to initialise the multi pages menu!');
			return;
		}

		this.pages.set(msg.id, {
			pages: embeds,
			currentPage: initPage,
			user: message.author.id,
			msg: msg,
			customEmojis: customEmojis
		});
		return msg;
	},

	/**
	 * Delete a multi page embed
	 * @param msg The message of this multi page embed
	 * */
	delete(msg: Message) {
		const pagination = this.pages.get(msg.id);
		if (!pagination) return false;

		if (pagination.msg.deletable) pagination.msg.delete().catch(() => null);
		this.pages.delete(msg.id);

		return true;
	},

	/**
	 * Function to toggle pages. This should never be called from outside the messageReactionAdd event
	 * @param reaction The reaction
	 * @param user The user
	 */
	browse(reaction: MessageReaction, user: User) {
		const msg = reaction.message as Message;
		const pagination = this.pages.get(msg.id);
		if (
			!pagination ||
			pagination.user !== user.id ||
			!(pagination.customEmojis || this.defaultEmojis).some(r => reaction.emoji.name === r || reaction.emoji.id === r)
		)
			return;

		reaction.users.remove(user).catch(() => null);

		if (pagination.customEmojis) {
			if (pagination.currentPage === pagination.customEmojis.indexOf(reaction.emoji.id ?? reaction.emoji.name)) return;
			pagination.currentPage = pagination.customEmojis.indexOf(reaction.emoji.id ?? reaction.emoji.name);
		} else
			switch (reaction.emoji.name) {
				case '⏮️':
					if (pagination.currentPage === 0) return;
					pagination.currentPage = 0;

					break;
				case '⬅️':
					if (pagination.currentPage === 0) return;
					pagination.currentPage -= 1;
					break;
				case '⏹️':
					this.delete(msg);
					break;
				case '➡️':
					if (pagination.currentPage === pagination.pages.length - 1) return;
					pagination.currentPage += 1;
					break;
				case '⏭️':
					if (pagination.currentPage === pagination.pages.length - 1) return;
					pagination.currentPage = pagination.pages.length - 1;
					break;
			}

		pagination.msg
			.edit(pagination.pages[pagination.currentPage])
			.catch(() => this.handleError(pagination, msg.id))
			.catch(() => null);
	},

	handleError(page: Page, id: string) {
		if (page.msg.deletable) page.msg.delete().catch(() => null);
		this.pages.delete(id);
	}
};

interface Page {
	pages: Array<MessageEmbed>;
	currentPage: number;
	user: string;
	msg: Message;
	customEmojis?: Array<string>;
}

import { Message as BaseMessage, Guild, GuildMember, TextChannel, NewsChannel } from 'discord.js';
import { Client } from '..';

export interface Message extends BaseMessage {
	client: Client;
}

export interface GuildMessage extends Message {
	guild: Guild;
	member: GuildMember;
	channel: TextChannel | NewsChannel;
}

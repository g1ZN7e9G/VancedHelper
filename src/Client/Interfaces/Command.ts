import { PermissionString, Message, Message as BaseMessage } from 'discord.js';

export interface Command {
	hidden?: boolean;
	cooldown?: number;
	aliases: string[];
	description: string;
	args: number;
	usage: string;
	devOnly: boolean;
	guildOnly: boolean;
	memberPermission: PermissionString[];
	botPermission: PermissionString[];
	callback(message: Message, args: string[]): Promise<BaseMessage | void>;
}

export interface FullCommand extends Command {
	name: string;
	category: string;
	cooldown: number;
}

export interface RecentCommand {
	channelID: string;
	msgID: string;
	res: Message;
}

export type CommandCategories = 'Dev' | 'Fun' | 'Utility' | 'Settings';

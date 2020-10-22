import { Command, Message } from '../../Client';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message) => {
	return msg.channel.send(
		stripIndents`
			⏱️ **__Uptime:__**
			**Node:** \`${msg.client.helpers.msToHuman(process.uptime() * 1000)}\`
			**Client:** \`${msg.client.helpers.msToHuman(msg.client.uptime!)}\``
	);
};

export const command: Command = {
	aliases: [],
	description: "Check the bot's uptime",
	usage: '',
	devOnly: true,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

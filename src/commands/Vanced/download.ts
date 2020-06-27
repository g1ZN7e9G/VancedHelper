import { Command, Message } from '../../Client';

const callback = async (msg: Message, _args: string[]) => {
	const output = msg.client
		.newEmbed('INFO')
		.setThumbnail('https://i.imgur.com/mFkZnUB.png')
		.setTitle('Official Downloads')
		.addFields([
			{ name: 'Discord', value: 'Just download from <#517803059821281280>' },
			{ name: 'Official Website', value: '[Vanced.app](https://vanced.app)' },
			{
				name: 'AndroidFileHost',
				value: '[Youtube Vanced](https://androidfilehost.com/?w=files&flid=294874) | [Vanced MicroG](https://androidfilehost.com/?w=files&flid=294875)'
			},
			{
				name: 'Mediafire',
				value:
					'[Youtube Vanced](https://www.mediafire.com/folder/773e97cz2ezx1/AddFree_Youtube_BackgroundPlay_Enabled#tipud73tn4lo1) | [Vanced MicroG](https://www.mediafire.com/folder/773e97cz2ezx1/AddFree_Youtube_BackgroundPlay_Enabled#qdy8ps6d9sho7)'
			}
		]);

	return msg.channel.send(output);
};

export const command: Command = {
	aliases: ['downloads', 'dl', 'mirrors'],
	description: 'Get a list of available download mirrors',
	usage: '',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

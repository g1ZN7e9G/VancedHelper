module.exports = {
	name: 'membercount',
	description: 'Checks the member count of a server.',
	usage: ' ',
	aliases: ['mc', 'members'],
	guildonly: true,
	devonly: false,
	args: false,
	modCommand: false,
	category: 'Misc',
	execute(message, args) {
		message.channel.send(`This server has ${message.guild.memberCount} members.`);
	},
};
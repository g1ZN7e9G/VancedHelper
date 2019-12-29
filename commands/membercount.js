module.exports = {
	name: 'membercount',
	description: 'Checks the member count of a server.',
	usage: ' ',
	aliases: ['mc', 'members'],
	guildonly: true,
    devonly: false,
    args: false,
    modCommand: false,
	execute(message, args) {
		// Check whether command is used in guild, if not, return
		if(!message.guild) return message.channel.send(`This command only works on servers.`);
		// Send member count including bots
		message.channel.send(`This server has ${message.guild.memberCount} members.`);
	},
};
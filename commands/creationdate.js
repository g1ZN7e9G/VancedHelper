module.exports = {
	name: 'creationdate',
    description: 'Should be obvious.',
    args: false,
    usage: ' ',
    aliases: [ 'cd', 'createdwhen'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
	execute(message, args) {
        return message.channel.send(`This server was created on ${message.guild.createdAt}`)
    },
};
const Discord = require('discord.js');
const { prefix } = require('config')
module.exports = {
	name: 'version',
    description: 'Informs you about the latest version numbers.',
    aliases: ['latest', 'v'],
    usage: ' ',
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .addField('Youtube Vanced', '14.21.54', false)
        .addField('Vanced Microg', '0.2.6.17455-dirty', false)
        .setTitle('Latest Versions')
        .setDescription(`These are the latest versions. Please make sure you have these. For download links, type ${prefix}download.`)
        .setTimestamp()
        return message.channel.send(output)
    },
};
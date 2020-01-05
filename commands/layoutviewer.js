const Discord = require('discord.js');
module.exports = {
	name: 'layoutviewer',
    description: 'Guide on how to use a Layout Viewer to properly report layout bugs.',
    usage: '',
    aliases: [ 'layout', 'devhelper' ],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        //.addField('', '', false)
        //.setThumbnail('')
        .setTitle('')
        //.setDescription('')

        return message.channel.send(output)
    },
};
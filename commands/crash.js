const Discord = require('discord.js');
module.exports = {
	name: 'crash',
    description: 'Is your Vanced crashing when trying to open it? Try this!',
    usage: ' ',
    aliases: ['forceclose', 'close'],
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .addField('Stick with Dark/Pink/Blue', 'Uninstall both apps, then install MicroG and then Vanced.', false)
        .addField('Switch to Black', 'Just download the black apk and install it as update.', false)
        .setThumbnail('https://i.imgur.com/aLAw00S.png')
        .setTitle('How to fix Vanced constantly crashing')
        .setDescription(`You are not using the recommended (black) version.
                        This is no big deal, but if you don't use Black, you have to install MicroG first or your Vanced will constantly crash. 
                        Please follow either of the advice below to fix your issue!`)
        .setTimestamp()
        return message.channel.send(output)
    },
};
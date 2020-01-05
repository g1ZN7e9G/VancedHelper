const Discord = require('discord.js')
module.exports = {
	name: 'xinto',
    description: 'Displays Quotes by famous philosopher and scientist Xinto aka MrKali.',
    usage: ' ',
    aliases: ['5iq', 'idiot'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
	execute(message, args) {
        const quotes = [
            'Yeah, YouTube refuses to recompile, did they add any security layers to apk or what is happening lol?',
            'Any Debian > arch',
            'Kali Linux best Linux distro',
            'Install Kali',
            'The switched to OPENGL2.0',
            'He wants Ira to become new Syria',
            `that's the meaning of making hentai\nlike if you had sex than it's pointless to make hentai because you can just have sex\neasy`,
            'change package name via android studio or something else\nI believe apk editor will work too',
            'But I recommend installing refind',
            'dude you have to try ZorinOS\nBest xfce environment\nSuper beautiful',
            `Does anyone use playonlinux?\nIt's not for games only\nIt's just name\nIt's actually better wine`,
            'You should have withdrawn that money',
            'Good thing git deletes junk automatically',
            ''
        ]
        const output = new Discord.RichEmbed()
        .setTimestamp()
        .setAuthor('Xinto', 'https://i.imgur.com/81WXBaF.png')
        .setColor('00ffff')
        .setDescription(quotes[Math.floor((Math.random() * quotes.length))])
        .setThumbnail('https://i.imgur.com/Bx9yapT.png')
        
        return message.channel.send(output)
    },
};
const functions = require('../../utils/functions.js');
module.exports = {
    name: 'xinto',
    description: 'Displays Quotes by famous philosopher and scientist Xinto aka MrKali.',
    usage: ' ',
    aliases: ['5iq', 'idiot'],
    guildonly: false,
    developersOnly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message) {
        const quotes = [
            'Yeah, YouTube refuses to recompile, did they add any security layers to apk or what is happening lol?',
            'Any Debian > arch',
            'Kali Linux best Linux distro',
            'Install Kali',
            'The switched to OPENGL2.0',
            'He wants Ira to become new Syria',
            'that\'s the meaning of making hentai\nlike if you had sex than it\'s pointless to make hentai because you can just have sex\neasy',
            'change package name via android studio or something else\nI believe apk editor will work too',
            'But I recommend installing refind',
            'dude you have to try ZorinOS\nBest xfce environment\nSuper beautiful',
            'Does anyone use playonlinux?\nIt\'s not for games only\nIt\'s just name\nIt\'s actually better wine',
            'You should have withdrawn that money',
            'Good thing git deletes junk automatically',
            'Bruh I thought YT detected microg and put ads because of it',
            'Also you should be using magisk version of Vanced\nAnd not non root\nAs this ads appear on non root only',
            "How can something that they don't have can be infected ?",
            'For me 2 days of using python was enough\n<:sir:614849156934139908>\nOS is much easier',
            "I didn't follow that tutoria\nInstead I used mix sign"
        ];
        const output = functions.newEmbed()
            .setAuthor('Xinto', 'https://i.imgur.com/81WXBaF.png')
            .setDescription(quotes[Math.floor((Math.random() * quotes.length))])
            .setThumbnail('https://i.imgur.com/Bx9yapT.png');

        return message.channel.send(output);
    },
};
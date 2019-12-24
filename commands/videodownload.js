const Discord = require('discord.js');
module.exports = {
	name: 'videodownload',
    description: 'Answers whether Video Download will ever be a feature',
    aliases: ['videodl', 'downloadfeature', 'howtodownload', 'vdl'],
    usage: ' ',
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .setThumbnail('https://i.imgur.com/NYmMUq5.png')
        .setTitle('Downloading Videos')
        .setDescription(`Downloading videos has never been and will never be a feature of Vanced. It led to the closing of many Youtube Mods in the past.
                        [In some regions](https://support.google.com/youtube/answer/6141269?co=GENIE.Platform%3DAndroid&hl=en) however, downloading is free.\n
                        For downloading, use a third party tool like [Ymusic](https://ymusic.io).`)
        .setTimestamp()
        return message.channel.send(output)
    },
};
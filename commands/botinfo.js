const Discord = require('discord.js');
module.exports = {
	name: 'botinfo',
    description: 'Get information about the bot.',
    usage: ' ',
    aliases: ['binfo'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Dev',
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .setThumbnail('https://cdn.discordapp.com/avatars/658352336787472386/7a77a973f56971532016ebc055f9c381.png')
        .setTitle('Information about the bot')
        .addField('Version', process.env.VERSION ? process.env.VERSION : "unknown", false)
        .addField('Commit', process.env.COMMIT ? `[${process.env.COMMIT.slice(0, 7)}](https://github.com/YTVanced/VancedHelper/commit/${process.env.COMMIT})` : "unknown", false)
        .addField('Commit message', process.env.COMMIT_MESSAGE ? process.env.COMMIT_MESSAGE : "unknown", false)

        return message.channel.send(output)
        
    },
};
const Discord = require('discord.js')
module.exports = {
	name: 'choose',
    description: 'Choose between any amount of options seperated by |',
    usage: '[option 1 | option 2 | ... | option n',
    aliases: ['decide'],
    guildonly: false,
    devonly: false,
    args: true,
    modCommand: false,
	execute(message, args) {
        const choices = args.join(' ').split(' | ')
        if(choices.length == 1) return message.channel.send('You only gave me one choice, silly!')
        const choice = choices[Math.floor(Math.random() * choices.length)]
        const output = new Discord.RichEmbed()
        .setTimestamp()
        .setColor('00ffff')
        .addField('I choose...', choice, false)
        .setFooter(message.author.tag, message.author.avatarURL)

        return message.channel.send(output)
    },
};
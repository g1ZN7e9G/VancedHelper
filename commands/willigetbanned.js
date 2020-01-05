const Discord = require('discord.js');
module.exports = {
	name: 'willigetbanned',
    description: 'Answers whether you will get banned for using Vanced.',
    aliases: ['banned', 'risk', 'tosbreak'],
    usage: ' ',
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .setImage('https://i.imgur.com/IIJcQ4Z.png')
        .setThumbnail('https://i.imgur.com/6xeelhB.png')
        .setTitle('No, you won\'t get banned for using Vanced.')
        .setDescription(`No, Youtube's new ToS do not state that your account might be removed due to not being commercially available. In other words, youtube will not ban you for using adblock or vanced.\n\n` +
                        `However, you  use Vanced at your own discretion. Seeing as it is an unofficial client and as we can't predict what youtube will do in the future, there's always a very slight risk, and we can't guarantee your account's safety.`)
        .setTimestamp()
        return message.channel.send(output)
    },
};
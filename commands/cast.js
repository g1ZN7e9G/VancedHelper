const Discord = require('discord.js');
module.exports = {
	name: 'cast',
    description: 'Get info on Casting to TV with Vanced.',
    usage: ' ',
    aliases: ['casting', 'tv'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .setThumbnail('https://i.imgur.com/gvNSmzo.png')
        .setTitle('Casting to TV')
        .setDescription(`Casting to TV doesn't actually cast, it just makes your TV open its Youtube app and play the video there.\n` +
                        `This means that casting to TV will use the standard Youtube player which has ads and lacks the Vanced modifications.\n` +
                        `There's nothing Vanced can do about this and this is **not a bug**.`)

        return message.channel.send(output)
    },
};
const Discord = require('discord.js')
module.exports = {
	name: 'servericon',
    description: 'Sends the Server Icon.',
    usage: ' ',
    aliases: ['si', 'serverlogo'],
    guildonly: true,
    devonly: false,
    args: false,
    modCommand: false,
	execute(message, args) {
        // Check whether command is used in guild, if not, return
        if(!message.guild) return message.channel.send(`This command only works on servers.`);
        const output = new Discord.RichEmbed()
        .setColor('00ffff')
        .setTimestamp()
        .setImage(message.guild.iconURL)
        .setDescription(`${message.guild.name}'s Server logo`)
        return message.channel.send(output);
    },
};
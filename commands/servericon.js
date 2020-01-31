const functions = require('../functions.js')
module.exports = {
    name: 'servericon',
    description: 'Sends the Server Icon.',
    usage: ' ',
    aliases: ['si', 'serverlogo'],
    guildonly: true,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message, args) {
        const output = functions.newEmbed()
            .setImage(message.guild.iconURL)
            .setDescription(`${message.guild.name}'s Server logo`)
        return message.channel.send(output);
    },
};
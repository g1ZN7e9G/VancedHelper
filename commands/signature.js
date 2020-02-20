const functions = require('../functions.js')
module.exports = {
	name: 'signature verification',
    description: '',
    usage: '',
    aliases: [],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
	execute(message, args) {
        const output = functions.newEmbed()
        .addField('Using yellow man (Lucky Patcher)', '', false)
        //.setThumbnail('')
        .setTitle('How to disable signature verification on rooted devices')
        .setDescription('To be able to Install Vanced on rooted devices, you need to have Signature Verification disabled.\nThis guide will show you 2 methods of disabling signature verification')

        return message.channel.send(output)
    },
};
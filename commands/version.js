const functions = require('../functions.js')
module.exports = {
    name: 'version',
    description: 'Informs you about the latest version numbers.',
    aliases: ['latest', 'v'],
    usage: ' ',
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message, args) {
        const output = functions.newEmbed()
            .addField('Youtube Vanced', '15.05.54', false)
            .addField('Vanced Microg', '0.2.6.17455-dirty', false)
            .setTitle('Latest Versions')
            .setDescription(`These are the latest versions. Please make sure you have these. For download links, type ${functions.prefix}download.`)

        return message.channel.send(output)
    },
};

const functions = require('../functions.js')
module.exports = {
    name: 'uncolour',
    description: 'Shuts down the bot. Bot Owner only.',
    usage: ' ',
    aliases: ['die', 'kys'],
    guildonly: false,
    devonly: true,
    args: false,
    modCommand: false,
    category: 'Dev',
    execute(message, args) {
        functions.uncolour(message.client)
    },
};
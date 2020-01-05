const { adminid } = require('config');
module.exports = {
    name: 'shutdown',
    description: 'Shuts down the bot. Bot Owner only.',
    usage: ' ',
    aliases: ['die', 'kys'],
    guildonly: false,
    devonly: true,
    args: false,
    modCommand: false,
    category: 'Dev',
    execute(message, args) {
        message.channel.send('*dies*').then(() => {
            process.exit();
        })
    },
};
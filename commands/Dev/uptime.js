const functions = require('../../utils/functions.js');
module.exports = {
    name: 'uptime',
    description: 'Returns the uptime of the bot.',
    extended: '',
    usage: '',
    aliases: ['up'],
    guildonly: false,
    developersOnly: true,
    args: false,
    category: 'Dev',
    execute(message) {
        message.channel.send(`⏱️ **__Uptime:__**\n**Node:** \`${functions.msToHuman(process.uptime() * 1000)}\`\n**Client:** \`${functions.msToHuman(message.client.uptime)}\``);
    }
};
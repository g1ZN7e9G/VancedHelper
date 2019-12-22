const { ownerID } = require('../config.json');
module.exports = {
	name: 'shutdown',
    description: 'Shuts down the bot. Bot Owner only.',
    args: false,
    usage: ' ',
    aliases: ['die', 'kys'],
    guildOnly: false,
	execute(message, args) {
        // Check if user is Owner
        if(message.author.id != ownerID) return message.channel.send('Only the bot owner can use this command.');

        // Shut down
        message.channel.send('*dies*').then(() => {
        process.exit();
        })
    },
};
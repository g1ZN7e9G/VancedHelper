module.exports = {
	name: 'ping',
    description: 'Should be obvious.',
    args: false,
    usage: '',
    guildOnly: false,
	execute(message, args) {
        return message.channel.send(`Ping: \`${Math.floor(message.client.ping)}ms\``)
    },
};
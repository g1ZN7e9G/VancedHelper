module.exports = {
    name: 'emoji',
    description: 'Should be obvious.',
    usage: '',
    aliases: ['ms'],
    guildonly: false,
    devonly: false,
    args: true,
    modCommand: false,
    category: 'Utility',
    execute(message, args) {
        const emoji = message.client.emojis.get(args[0].replace(/\D/g, ''));
        if (!emoji) return message.channel.send('Sir, dis not an emote I can access...');
        return message.channel.send(emoji.url);
    },
};
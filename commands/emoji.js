module.exports = {
    name: 'emoji',
    description: 'Sends the URL of an Emoji the bot has access to.',
    usage: '[emoji]',
    aliases: ['e'],
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
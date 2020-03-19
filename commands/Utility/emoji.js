const functions = require('../../utils/functions.js');
module.exports = {
    name: 'emoji',
    description: 'Sends the URL of the provided emoji.',
    usage: '[emoji]',
    aliases: ['e'],
    guildonly: false,
    developersOnly: false,
    args: true,
    modCommand: false,
    category: 'Utility',
    execute(message, args) {
        const regex = /<(:|a:)[ A-Za-z0-9_@./#&+-]+:\d+>/i;
        const emoji = args.join(' ').match(regex);
        if (emoji === null)
            return functions.errorMessage(message, 'You did not provide any emoji!');
        const emojiId = emoji[0].replace(/\D/g, '');
        const url = message.client.emojis.cache.get(emojiId);
        if (url)
            return message.channel.send(url);
        const extension = emoji[0].slice(1).startsWith('a') ? 'gif' : 'png';
        return message.channel.send(`https://cdn.discordapp.com/emojis/${emojiId}.${extension}`);
    },
};
const functions = require('../../utils/functions.js');
module.exports = {
    name: 'mint',
    description: 'Displays Quotes by famous idiot Mint',
    usage: ' ',
    aliases: '0iq',
    guildonly: false,
    developersOnly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message) {
        const quotes = [
            'I bought minecraft for 40 dollars',
            'Being gay isn\'t a sin',
            'I do pixel art \n And gimp is best for that',
            'You will have to wait 10 hours for gimp to load',
            'MiUI is the best ROM',
            'Xiaomi has best apps',
            'Does WhatsApp give you an phone number?',
            'Hazel is a sexual predator',
            'Ii Visual Studio safe to uninstall?',
            'Can i get Creative Cloud for free without CC?',
            'I bought Minecraft Cheat for 30 dollars',
            'How do i delete folders?',
            'What is Google?',
            'I edited registry without backing it up',
            'Can you export regedit and give it to me?',
            'What\'s official Java download link?',
            'I am cute',
            'Make malware that uninstalls microsoft edge pls'
        ];
        const output = functions.newEmbed()
            .setAuthor('Mint', 'https://cdn.discordapp.com/avatars/714767524243439738/2cdc91ae9f66ccf062a37967d6a24806.png')
            .setDescription(quotes[Math.floor((Math.random() * quotes.length))])
            .setThumbnail('https://i.imgur.com/bUde1EU.png');

        return message.channel.send(output);
    },
};

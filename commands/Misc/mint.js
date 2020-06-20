const functions = require('../../utils/functions.js');
module.exports = {
    name: 'mint',
    description: 'Displays Quotes by famous idiot Mint',
    usage: ' ',
    aliases: ['0iq'],
    guildonly: false,
    developersOnly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message) {
        const quotes = [
            'I bought it for 40 dollars',
            'Being gay isn\'t a sin',
            'I do pixel art \n And gimp is best for that',
            'You will have to wait 10 hours for gimp to load', 
            'Does WhatsApp give you an phone number?',
            'Hazel is a sexual predator',
            'safe to uninstall?\n[screenshot of visual studio redistributable]',
            'Can i get it for free without CC?',
            'it\'s opensource but it\'s an backdoor',
            'How do i delete folders?',
            'What is Google?',
            'can you open regedit export it and give it to me pretty please\ni messed with it without backing it up',
            'What\'s official Java download link?',
            'I am cute',
            'Make malware that uninstalls microsoft edge pls',
            'Im not saying that opensource means its safe',
            'Opensource software tends to suck',
            '[github link] - is this opensource? i can\'t tell',
            'google never lies',
            'i dont use any google services except android',
            'TOR is not only used for darkweb it\'s supposed to be for privacy',
            'OgYoutube is made for privacy',
            'shut up'
        ];
        const output = functions.newEmbed()
            .setAuthor('Mint', 'https://cdn.discordapp.com/avatars/714767524243439738/2cdc91ae9f66ccf062a37967d6a24806.png')
            .setDescription(quotes[Math.floor((Math.random() * quotes.length))])
            .setThumbnail('https://i.imgur.com/bUde1EU.png');

        return message.channel.send(output);
    },
};

module.exports = {
	name: '8ball',
    description: 'Ask a yes or no question and the 8ball will respond.',
    usage: '[question]',
    aliases: ['fortune'],
    guildonly: false,
    devonly: false,
    args: true,
    modCommand: false,
    category: 'Misc',
	execute(message, args) {
        const responses = [ 'Totally!', 'Yes!', 'Definitely!', 'Probably.', 'Very likely.', 'Likely.', 'Unlikely.', 'I wouldn\'t count on it.', 'No!', 'Definitely not!', 'Nope!', 'No way!']   
        return message.channel.send(responses[Math.floor(Math.random() * responses.length)])
    },
};
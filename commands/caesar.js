const Discord = require('discord.js');
const { prefix } = require('config');
module.exports = {
	name: 'caesar',
    description: 'A simple caesar cipher.',
    usage: '[decrypt|encrypt] [shiftAmount] [text]',
    aliases: ['cipher'],
    guildonly: false,
    devonly: false,
    args: true,
    modCommand: false,
    category: 'Misc',
	execute(message, args) {
    // Check if 3 args are provided, if not, return
    if(!args[2]) return message.channel.send(`Missing input. Please refer to the \`${prefix}help caesar\` page.`)

    // Define array of alphabet for later use
    const alphabet = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'.split('');
    
    // Get action encrypt/decrypt
    var action = args[0].toLowerCase()
    if(action != 'decrypt' && action != 'encrypt') return message.channel.send('Please select a valid action. Options are `decrypt` or `encrypt`.')
    
    // Get shift amount 1-25
    var shift = parseInt(args[1])
    if (isNaN(shift) || shift == 0 || shift > 25) return message.channel.send('Please provide a shift amount between 1 and 25.')
    
    // Rest of args is input text, remove spaces and combine to one String
    var input = ''
    for(let i=2; i < args.length; i++) input += args[i].toLowerCase()

    // Split message into array with single letters
    const worker = input.split('')

    // Define output var
    var output = ''
    
    // Script to encrypt/decrypt
    if(action == 'encrypt')
    for(let i = 0; i < input.split('').length; i++) {
        // If alphabet includes current latter, add [letter in array at position of the original letter + the shift amount] to our output
        if(alphabet.includes(worker[i])) output += alphabet[alphabet.indexOf(worker[i]) + shift]
    }
    else if(action == 'decrypt')
        for(let i = 0; i < input.split('').length; i++) {
        // If alphabet includes current latter, add [letter in array at position of the original letter - the shift amount] to our output
        if(alphabet.includes(worker[i])) output += alphabet[alphabet.lastIndexOf(worker[i]) - shift]
    }

    // Create output embed
    const embed = new Discord.RichEmbed()
    .setAuthor('Caesar Cipher')
    .setColor('00d084')
    .addField('Your input', input, false)
    .addField('Shift amount', shift, false)
    .addField(`The ${action}ed output`, output, false)
    .setTimestamp()

    // Send output in embed form and normal message form (latter for copy paste on mobile)
    message.channel.send(embed)
    message.channel.send(output)
    },
};
const Dicsord = require('discord.js')
module.exports = {
	name: 'avatar',
    description: 'Sends the avatar of a @user or yourself.',
    usage: '<@user>',
    aliases: ['icon', 'pfp', 'av'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
	execute(message, args) {
        const output = new Dicsord.RichEmbed()
        .setColor('00ffff')
        .setTimestamp()

        if (args[0]) {
            const user = message.mentions.users.first();
            var username = user.username; 
            // If name ends with s/z, add ', else add 's
            if(!username.endsWith('s') && !username.endsWith('z') && !username.endsWith('S') && !username.endsWith('Z')) username += `'s`; else username += `'`
            
            // output if args (!user)
            if (!user) {
                output.setDescription('Please use a proper mention if you want to see someone else\'s avatar.');
                return message.channel.send(output);
            }
            
            // output if args (user)
            output
            .setTitle(`${username} avatar`)
            .setImage(user.displayAvatarURL)
            return message.channel.send(output);
        }
        
        // output if !args
        output
        .setTitle(`${message.author.username}, your avatar`)
        .setImage(message.author.displayAvatarURL);

        return message.channel.send(output);
    },
};
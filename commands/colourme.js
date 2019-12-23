const Dicsord = require('discord.js');
module.exports = {
    name: 'colourme',
    description: 'Gives the Booster a coloured role.',
    usage: '[colour in hex]',
    aliases: ['setcolor','colorme'],
    execute(message, args) {
        if(!args[0]) return message.channel.send('Missing input. Please refer to the `-help colourme` page.')
        if (message.member.roles.some(r => r.name === "Nitro Booster")) {
            var CC = message.guild.roles.find(r => r.name == "CC")
            if (message.member.roles.some(r => r.name == "CC")) {
                message.member.colorRole.edit({color: args[0].toUpperCase(), name: args[0].toUpperCase()})
                return message.channel.send("Colour changed")
            } else {
                message.guild.createRole({
                    name: args[0].toUpperCase(),
                    color: args[0].toUpperCase(),
                    position: CC.position + 1,
                })
                .then(role => message.member.addRole(role))
                .catch(console.error);
                message.member.addRole(CC).catch(console.error)
                return message.channel.send("Colour added")
            }
        } else {
            return message.channel.send("You're not a booster smh")
        } 
    },
};
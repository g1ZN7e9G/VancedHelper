const { prefix } = require('../config.json');
module.exports = {
    name: 'colourme',
    description: 'Gives the Booster a coloured role.',
    usage: '[colour in hex] <custom role name>',
    aliases: ['setcolor','colorme'],
    execute(message, args) {
        if(!args[0]) return message.channel.send(`Missing input. Please refer to the \`${prefix}help colourme\` page.`)

        const validHex = /[0-9A-Fa-f]{6}/g;
        if(!validHex.test(args[0]) || args[0].length > 6) return message.channel.send('Woah, that\'s not a valid hex.')
        if(args[0] == '000000') return message.channel.send('For black, use any hex >000000 eg. 000001.')
        
        var name = ''
        if(args[1]) for(let i = 1; i < args.length; i++) name += args[i].replace(/\W/g, '') + ' '; else name = args[0].toUpperCase() + ' '
        name = name.slice(0, -1)
        if(message.guild.roles.some(r => r.name.toLowerCase() == name.toLocaleLowerCase()) && !message.member.roles.some(r => r.name.toLowerCase() == name.toLocaleLowerCase())) return message.channel.send('Not funny, didn\'t laugh. Please don\'t impersonate staff, kthxbai.')
        
        try {
            if(name.length > 25) return message.channel.send('Woah, calm down. Character limit is 25.')
        if (message.member.roles.some(r => r.name === "Nitro Booster")) {
            var CC = message.guild.roles.find(r => r.name == "CC")
            if (message.member.roles.some(r => r.name == "CC")) {
                message.member.colorRole.edit({color: args[0].toUpperCase(), name: name})
                message.channel.send("Colour changed")
                return message.client.channels.get('658781799580827648').send(`${message.author.tag} just changed their custom role to \`${name}\`.`)
            } else {
                message.guild.createRole({
                    name: name,
                    color: args[0].toUpperCase(),
                    position: CC.position + 1,
                })
                .then(role => message.member.addRole(role))
                .catch(console.error);
                message.member.addRole(CC).catch(console.error)
                message.channel.send("Colour added")
                return message.client.channels.get('658781799580827648').send(`${message.author.username} just changed their custom role to \`${name}\`.`)
            }
        } else {
            return message.channel.send("You're not a booster smh")
        } 
    }
    catch(error) {
        console.error(error);
    }
}
};
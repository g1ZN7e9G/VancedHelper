const Discord = require('discord.js')
const config = require('config')

exports.logchannel = config.logchannel;
exports.prefix = config.prefix

exports.newEmbed = () => {
    return new Discord.RichEmbed().setTimestamp().setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
};

exports.logCommand = (message, command, args) => {
    try {
        const output = new Discord.RichEmbed()
            .setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setDescription(`**Issued the command \`${command.name}\` in ${message.channel}**`)
            .setFooter(`Author: ${message.author.id} | Message ID: ${message.id}`)
            .setTimestamp()

        if (args && args.length) {
            output.addField('Args', args.join(' '), false)
        }

        return message.client.channels.get(config.logchannel).send(output)
    }
    catch (error) {
        console.error(error)
        message.client.channels.get(config.errorChannel).send(`<@${config.devs.join('> <@')}> An error occured!\n\`\`\`js\n${error.stack}\`\`\``)
    }
};

exports.uncolour = (client) => {
    try {
        const guild = client.guilds.get('328493314485518336')
        const colorRoles = []
        const victims = []
        guild.roles.forEach(role => {
            if (role.name.endsWith('-CC'))
                colorRoles.push(role)
        })
        colorRoles.forEach(role => {
            if (!role.members.size) return role.delete();
            role.members.forEach(member => {
                if (!member.roles.find(r => r.name === "Nitro Booster")) {
                    role.delete();
                    victims.push(member.user.tag)
                }
            })

        })
        const output = victims.length ? `Removed the Colour Role(s) from ${victims.join(', ')}` : 'Noone new removed their boost!'
        console.log(output)
        client.channels.get(config.logchannel).send(output)
    }
    catch (err) {
        console.error(err)
    }
};
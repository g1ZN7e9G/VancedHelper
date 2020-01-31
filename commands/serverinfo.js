const functions = require('../functions.js')
module.exports = {
    name: 'serverinfo',
    description: 'Displays a ton of info about the server.',
    usage: ' ',
    aliases: ['server', 'guildinfo', 'gi'],
    guildonly: true,
    adminonly: false,
    args: false,
    modCommand: false,
    category: 'Misc',
    execute(message, args) {
        var roles = []
        var channelSize = 0
        var channels = []
        const g = message.guild
        var description = `**Owner:** \`${g.owner.user.tag}\`\n**Guild Name:** \`${g.name}\`\n**ID:** \`${g.id}\`\n**Region:** \`${g.region}\`\n**Creation Date:** \`${g.createdAt.toString().split(' ').slice(-20, 4).join(' ')}\`\n**Member Count:** \`${g.memberCount}\`\n**Emoji Count:** \`${g.emojis.size}\``

        for (const [placeholder, k] of g.roles) {
            if (k != '@everyone') roles.push(k)
        }

        for (const [placeholder, k] of g.channels) {
            if (k.type == 'text') {
                channels.push(k)
                channelSize++
            }
        }

        const output = functions.newEmbed()
            .setAuthor('Guild Info', 'https://i.imgur.com/KS0cnM6.png')
            .setThumbnail(g.iconURL)
            .setFooter(message.author.tag, message.author.avatarURL)
            .setDescription(description)
        if (roles.join(' ').length < 1024) output.addField(`Roles [${g.roles.size - 1}]`, roles.join(', '), false);
        else output.addField(`Roles [${g.roles.size - 1}]`, 'Too many roles, can\'t display.', false);
        if (channels.join(' ').length < 1024) output.addField(`Channels [${channelSize}]`, channels.join(', '), false);
        else output.addField(`Channels [${g.channels.size - 1}]`, 'Too many channels, can\'t display.', false);
        if (g.splashURL) output.setImage(g.splashURL)

        return message.channel.send(output)
    },
};
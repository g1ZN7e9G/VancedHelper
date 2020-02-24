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
        const g = message.guild
        const roles = []
        const channels = []
        g.channels.filter(chan => chan.type === 'text').forEach(chan => channels.push(chan))
        g.roles.filter(role => role.name !== '@everyone').forEach(role => roles.push(role))

        const output = functions.newEmbed()
            .setAuthor('Guild Info', 'https://i.imgur.com/KS0cnM6.png')
            .setThumbnail(g.iconURL)
            .setFooter(message.author.tag, message.author.avatarURL)
            .setDescription(`**Owner:** \`${g.owner.user.tag}\`\n**Guild Name:** \`${g.name}\`\n**ID:** \`${g.id}\`\n**Region:** \`${g.region}\`\n**Creation Date:** \`${g.createdAt.toString().split(' ').slice(-20, 4).join(' ')}\`\n**Member Count:** \`${g.memberCount}\`\n**Emoji Count:** \`${g.emojis.size}\``)
            .addField(`Channels [${channels.length}]`, channels.join(', ').length > 1024 ? "Too many channels, can't display." : channels.join(', '))
            .addField(`Roles [${roles.length}]`, roles.join(', ').length > 1024 ? "Too many channels, can't display." : roles.join(', '))

        return message.channel.send(output)
    },
};

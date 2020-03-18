const functions = require('../../utils/functions.js');
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
    execute(message) {
        const g = message.guild;
        const channels = g.channels.cache.filter(channel => channel.type === 'text');
        const roles = g.roles.cache.filter(role => role.id !== g.id);

        const output = functions.newEmbed()
            .setAuthor('Guild Info', 'https://i.imgur.com/KS0cnM6.png')
            .setThumbnail(g.iconURL)
            .setFooter(message.author.tag, message.author.avatarURL)
            .setDescription(`**Owner:** \`${g.owner.user.tag}\`\n**Guild Name:** \`${g.name}\`\n**ID:** \`${g.id}\`\n**Region:** \`${g.region}\`\n**Creation Date:** \`${g.createdAt.toString().split(' ').slice(-20, 4).join(' ')}\`\n**Member Count:** \`${g.memberCount}\`\n**Emoji Count:** \`${g.emojis.size}\``)
            .addField(`Channels [${channels.size}]`, channels.map(channel => channel).join(', ').length > 1024 ? "Too many channels, can't display." : channels.map(channel => channel).join(', '))
            .addField(`Roles [${roles.size}]`, roles.map(role => role).join(', ').length > 1024 ? "Too many channels, can't display." : roles.map(role => role).join(', '));

        return message.channel.send(output);
    },
};

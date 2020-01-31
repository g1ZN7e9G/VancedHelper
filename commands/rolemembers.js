const functions = require('../functions.js')
module.exports = {
    name: 'rolemembers',
    description: 'Should be obvious.',
    usage: '',
    aliases: ['rm'],
    guildonly: true,
    devonly: true,
    args: true,
    modCommand: false,
    category: 'Misc',
    execute(message, args) {
        const role = message.guild.roles.find(role => role.name.toLowerCase().substring(0, args.join(' ').length) === args.join(' ').toLowerCase())
        if (!role) return message.channel.send('Sorry I couldn\'t find that role.')
        const roleMembers = role.members.map(m => m.user.tag).join('\n')
        if (roleMembers.length > 2048) return message.channel.send('Sorry, too many members, above message limit!')
        const output = functions.newEmbed()
            .setTitle(role.name)
            .setDescription(roleMembers)
            .setFooter(message.author.tag, message.author.avatarURL)
        return message.channel.send(output).catch(() => { return message.channel.send('ERROR - Probaby too many role members') })
    },
};

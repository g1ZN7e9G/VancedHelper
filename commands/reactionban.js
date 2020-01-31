const functions = require('../functions.js')
module.exports = {
    name: 'reactionban',
    description: 'Gives the mentioned user a role which will make them unable to add reactions. Requires you to setup a role named "reaction-ban" with the right permissions.',
    args: true,
    usage: '[@member] <reason>',
    aliases: ['reactban', 'rb'],
    guildonly: true,
    devonly: false,
    args: true,
    modCommand: true,
    category: 'Mod',
    execute(message, args) {
        const mod = message.author.tag;
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You require `Manage messages` permissions to use this command.');
        const member = message.mentions.members.first();
        if (!member) return message.channel.send('Please mention a member to reaction-ban.')
        var reason = []
        if (args[1]) reason = args.slice(1).join(' '); else reason = '-'
        const success = functions.newEmbed()
            .setAuthor('Reaction-Ban')
            .setDescription('User has successfully been reaction-banned!')
            .addField('User', member.user.tag, false)
            .addField('Moderator', mod, false)
            .addField('Reason', reason, false)
            .setThumbnail(member.user.avatarURL)
        member.addRole(message.guild.roles.find(role => role.name === "reaction-ban")).then((member) => {
            message.channel.send(success);
            message.client.channels.get(functions.logchannel).send(success)
        }).catch(() => {
            message.channel.send('Oops, something went wrong. Please make sure you got a role called `reaction-ban` set up on this server which is lower than my highest role.');
        });

    },
};
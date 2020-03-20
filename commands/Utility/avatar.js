const functions = require('../../utils/functions.js');
module.exports = {
    name: 'avatar',
    description: 'Sends the avatar of a @user or yourself.',
    extended: '',
    usage: '<@user>',
    aliases: ['icon', 'pfp', 'av'],
    guildonly: false,
    developersOnly: false,
    args: false,
    category: 'Utility',
    execute(message, args) {
        const output = functions.newEmbed();
        if (!args.length) {
            output
                .setTitle(`${message.author.username}, your avatar`)
                .setImage(message.author.displayAvatarURL({ size: 2048, dynamic: true }));

            return message.channel.send(output);
        }

        const member = functions.getMember(message, args, 0);
        if (!member)
            return functions.errorMessage(message, 'You did not provide a valid member. Please use the command again and provide a valid member.');

        const name = member.user.username.toUpperCase();
        const username = name.endsWith('Z') || name.endsWith('S') ? member.user.username + "'" : member.user.username + "'s";

        return message.channel.send(output.setTitle(`${username} avatar`).setImage(member.user.displayAvatarURL({ size: 2048, dynamic: true })));
    },
};
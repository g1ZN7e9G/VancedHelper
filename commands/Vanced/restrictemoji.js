const functions = require('../../utils/functions.js');
module.exports = {
    name: 'restrictemoji',
    description: 'Admin only command to restrict emotes to be usable only by the provided role',
    usage: '[Role] [Emoji1] <Emoji2> ...',
    aliases: ['restrict', 'res'],
    guildonly: true,
    developersOnly: true,
    args: true,
    modCommand: true,
    category: 'Dev',
    execute(message, args) {
        const role = functions.getRole(message, args, 0);
        if (!role) return functions.noRole(message);
        const action = args[1];
        if (!action) return functions.reply(message, 'You did not provide any action, silly!');
        if (action.toLowerCase() !== 'add' && action.toLowerCase() !== 'remove') return functions.reply(message, 'You did not provide a valid action (add/remove)!');
        args.splice(0, 2);
        if (!args.length) return functions.reply(message, 'You did not provide any emojis, silly!');

        const success = [];
        const fail = [];

        args.forEach(emote => {
            const emoji = message.guild.emojis.get(emote.replace(/\D/g, ''));
            if (!emoji) return fail.push(emote);
            emoji[action + 'RestrictedRole'](role);
            success.push(emote);
        });

        const output = functions.newEmbed()
            .setDescription(`I successfully ${action === 'add' ? 'added' : 'removed'} Restrictions for ${success.length} emojis.`);

        if (success.length) output.addField('Successfully restricted', success.join(' '));
        if (fail.length) output.addField('Failed to restrict', fail.join(' '));

        return message.channel.send(output);
    },
};
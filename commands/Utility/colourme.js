const functions = require('../../utils/functions.js');
module.exports = {
    name: 'colourme',
    description: 'Gives the Booster a coloured role.',
    usage: '[colour in hex] <custom role name>',
    aliases: ['setcolor', 'colorme'],
    guildonly: true,
    developersOnly: false,
    args: true,
    modCommand: false,
    botPermission: 'MANAGE_ROLES',
    category: 'Utility',
    async execute(message, args) {
        if (!message.member.roles.cache.some(r => r.name === 'Nitro Booster'))
            return functions.errorMessage(message, "You're not a booster smh");
        if (!(/[0-9A-Fa-f]{6}/g.test(args[0])) || args[0].length > 6)
            return functions.errorMessage(message, 'Woah, that\'s not a valid hex.');
        if (args[0] === '000000')
            return functions.errorMessage(message, 'For black, use any hex >000000 eg. 000001.');

        const name = args.splice(1).map(word => word.replace(/\W/g, '')).join(' ') || args[0];
        console.log(name);
        if (name.length > 25)
            return functions.errorMessage(message, 'Woah, calm down. Character limit is 25.');

        const colourRole = message.guild.roles.cache.find(role => role.name.toLowerCase() === name.toLowerCase());
        if (colourRole && !message.member.roles.cache.has(colourRole.id))
            return functions.errorMessage(message, 'This role name is already taken. Please choose another one.');

        const oldColourRole = message.member.roles.cache.find(role => role.name.endsWith('-CC'));
        if (oldColourRole) {
            oldColourRole.edit({
                name: name + '-CC',
                color: args[0].toUpperCase()
            });
            return message.channel.send('Colour changed!');
        }
        else {
            const janitor = message.guild.roles.cache.get('653556355352756224');
            const role = await message.guild.roles.create({
                data: {
                    name: name + '-CC',
                    color: args[0].toUpperCase(),
                    position: message.member.roles.cache.has(janitor.id) ? janitor.position + 1 : janitor.position - 1
                }
            });
            message.member.roles.add(role);
            return message.channel.send('Colour added!');
        }
    }
};
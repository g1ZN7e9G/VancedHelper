const functions = require('../../utils/functions.js');
const config = require('config');
module.exports = {
    name: 'help',
    description: 'Lists all commands or info on one command if provided.',
    extended: '',
    usage: '<command name>',
    aliases: ['h', 'info', 'i'],
    guildOnly: false,
    developersOnly: false,
    args: false,
    category: 'Utility',
    execute(message, args) {
        const output = functions.newEmbed().setAuthor('Help Menu', message.author.avatarURL);
        if (!args.length) {
            const commands = {
                Utility: [],
                Misc: [],
                Dev: [],
                Vanced: []
            };
            message.client.commands.forEach(command => {
                const category = commands[command.category] || commands.Misc;
                category.push(`\`${config.prefix}${command.name}\` - *${command.description}*`);
            });
            output
                .setTitle("Here's a list of all available commands!")
                .addFields(
                    [
                        { name: 'Vanced Commands', value: commands.Vanced.join('\n') },
                        { name: 'Utility Commands', value: commands.Utility.join('\n') },
                        { name: 'Miscellaneous Commands', value: commands.Misc.join('\n') }
                    ]
                )
                .setFooter(`Type ${config.prefix}help [command name] to get info on a specific command.`);
            return message.channel.send(output);
        }

        const name = args[0].toLowerCase();
        const command = message.client.commands.get(name) || message.client.commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command)
            return functions.errorMessage(message, "That's not a valid command!");
        if (command.developersOnly && !config.developers.includes(message.author.id))
            return;

        output
            .setAuthor(command.name.toUpperCase(), message.author.avatarURL)
            .addFields(
                [
                    { name: 'Description', value: command.description || '-' },
                    { name: 'Extended', value: command.extended || '-' },
                    { name: 'Usage', value: `\`${config.prefix + command.name} ${command.usage || ''}\``, inline: true },
                    { name: 'Aliases', value: command.aliases.join(', ') || '-', inline: true },
                ]
            );
        message.channel.send(output);
    },
};
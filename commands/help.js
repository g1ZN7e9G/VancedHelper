const { prefix } = require('config');
const Discord = require('discord.js');
module.exports = {
    name: 'help',
    description: 'Lists all commands or info on one command if provided.',
    usage: '<command name>',
    aliases: ['command', 'info', 'i'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message, args) {
        const output = new Discord.RichEmbed().setTimestamp().setAuthor('Help Menu', message.author.avatarURL).setColor('e5460e')
        const { commands } = message.client;

        if (!args.length) {
            var vancedCommandList = []
            var modCommandList = []
            var miscCommandList = []
            var helper = ''
            for (const k of message.client.commands.keys()) {
                helper = message.client.commands.get(k)
                switch(helper.category) {
                    case 'Vanced':
                        vancedCommandList.push(`\`${prefix}${helper.name}\` - *${helper.description}*`);
                        break;
                    case 'Mod':
                        modCommandList.push(`\`${prefix}${helper.name}\` - *${helper.description}*`);
                        break;
                    case 'Misc':
                        miscCommandList.push(`\`${prefix}${helper.name}\` - *${helper.description}*`);
                        break;
                    case 'Dev':
                        break;
                    default:
                        miscCommandList.push(`\`${prefix}${helper.name}\` - *${helper.description}*`);
                        break;
                }
            }
            output
            .setTitle("Here's a list of all available commands!")
            .addField('Vanced Commands', vancedCommandList.join('\n'), false)
            .addField('Moderator Commands', modCommandList.join('\n'), false)
            .addField('Miscellaneous Commands', miscCommandList.join('\n'), false)
            .setFooter(`Type ${prefix}help [command name] to get info on a specific command.`)
            return message.channel.send(output)
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.reply('That\'s not a valid command!');
        }

        var helper = `**Name:** \`${command.name}\`\n`;

        if (command.description) helper += (`\n**Description:** \`${command.description}\`\n`);
        if (command.usage) helper += (`\n**Usage:** \`${prefix}${command.name} ${command.usage}\`\n`);
        if (command.aliases) helper += (`\n**Aliases:** \`${command.aliases.join(', ')}\``); else helper += (`\n**Aliases:** -`)
        output.setAuthor(message.author.username + '#' + message.author.discriminator, message.author.avatarURL).setDescription(helper)
        
        message.channel.send(output);
    },
};
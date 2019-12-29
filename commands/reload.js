module.exports = {
    name: 'reload',
    description: 'Reloads a command. Bot Owner only.',
    usage: '[command]',
    guildonly: false,
    devonly: true,
    args: true,
    modCommand: false,
    execute(message, args) {
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);

        if (args[0] == 'all') {
            var output = []
            var commands = ''
            var helper = ''
            for (const k of message.client.commands.keys()) {
                helper = message.client.commands.get(k)
                        || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(k));
                commands = helper.name
                delete require.cache[require.resolve(`./${commands}.js`)];

                try {
                    const newCommand = require(`./${commands}.js`);
                    message.client.commands.set(newCommand.name, newCommand);
                } catch (error) {
                    console.log(error);
                    message.channel.send(`There was an error while reloading a command \`${commands}\`:\n\`${error.message}\``);
                }
                output.push(`Command \`${commands}\` was reloaded!`);
            }
            return message.channel.send(output.join('\n'))      
    }

        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
        const commandFinal = command.name

        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        delete require.cache[require.resolve(`./${commandFinal}.js`)];

        try {
            const newCommand = require(`./${commandFinal}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.log(error);
            message.channel.send(`There was an error while reloading a command \`${commandName}\`:\n\`${error.message}\``);
        }
        message.channel.send(`Command \`${commandFinal}\` was reloaded!`);

    },
};

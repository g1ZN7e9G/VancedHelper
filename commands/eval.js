module.exports = {
    name: 'eval',
    description: 'Runs code provided by dev.',
    usage: '',
    aliases: ['debug', 'code'],
    guildonly: false,
    devonly: true,
    args: true,
    modCommand: false,
    category: 'Dev',
    execute(message, args) {
        let output;
        try {
            output = eval(args.join(' '));
        }
        catch (err) {
            message.reply(`An error occured!\n\`\`\`js\n${err.stack}\`\`\``);
        }
        try {
            message.channel.send(`\`\`\`js\n${output}\`\`\``);
        }
        catch (err) {
            message.reply(`An error occured!\n\`\`\`js\n${err.stack}\`\`\``);
        }
    },
};
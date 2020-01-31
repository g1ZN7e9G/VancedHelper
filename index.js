const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, logchannel, devs, errorChannel } = require('config');
const functions = require('./functions.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const timer = setInterval(function () {
    functions.uncolour(client)
}, 1000 * 60 * 15);

client.once('ready', () => {
    client.user.setPresence({
        game: {
            name: `${prefix}help`,
            type: "PLAYING",
        }
    });
    client.channels.get(errorChannel).send(`<@${devs.join('> <@')}>\nSuccessfully logged in as ${client.user.username} - ${client.user.id}\nServing ${client.guilds.size} guilds\nPrefix: ${prefix}`)
    console.log(`Successfully logged in as ${client.user.username} - ${client.user.id}\nServing ${client.guilds.size} guilds\nPrefix: ${prefix}`);
});


client.on('message', message => {
    if (message.isMentioned(client.user)) message.channel.send(`**Prefix:** ${prefix}\nFor a list of commands, type \`${prefix}help\``);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.devonly && !devs.includes(message.author.id)) return
    if (command.guildonly && !message.channel.guild) return message.channel.send('This command can only be used on a server!')
    if (command.args && !args.length) return message.channel.send(`Missing input. Please refer to the \`${prefix}help ${command.name}\` page.`)

    try {
        functions.logCommand(message, command, args)

        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.client.channels.get(errorChannel).send(`<@${devs.join('> <@')}> An error occured!\n\`\`\`js\n${error.stack}\`\`\``)
        message.reply('Oops, something went wrong.').then(msg => msg.delete(3000));

    }
});

client.login(token);
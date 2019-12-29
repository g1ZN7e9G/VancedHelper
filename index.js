const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, logchannel, devs } = require('config');

const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setPresence({
        game: {
            name: `${prefix}help`,
            type: "PLAYING",
        }
    });
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
    if(command.devonly && !devs.includes(message.author.id)) return
    if(command.guildonly && !message.channel.guild) return message.channel.send('This command can only be used on a server!')
    if(command.args && !args.length) return message.channel.send(`Missing input. Please refer to the \`${prefix}help ${command.name}\` page.`)

    try {
        logCommand(message, command, args)

        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Oops, something went wrong.').then(msg => msg.delete(3000));

    }
});

client.login(token);

function logCommand(message, command, args) {
    try {
        const output = new Discord.RichEmbed()
            .setColor(Math.random().toString(16).slice(2, 8).toUpperCase())
            .setAuthor(`${message.author.tag}`, message.author.avatarURL)
            .setDescription(`**Issued the command \`${command.name}\` in ${message.guild.channel}**`)
            .setFooter(`Author: ${message.author.id} | Message ID: ${message.id}`)
            .setTimestamp()
  
        if (args && args.length) {
            output.addField('Args', args.join(' '), false)
        }

        return message.client.channels.get(logchannel).send(output)
    }
    catch (exception) {
        console.error(exception)
    }
}
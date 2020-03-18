const Discord = require('discord.js');
const fs = require('fs');
const config = require('config');
const functions = require('./utils/functions.js');

const client = new Discord.Client({
    disableMentions: 'everyone',
    presence: {
        activity: {
            name: `${config.prefix}help`,
            type: 'LISTENING'
        }
    }
});

client.commands = new Discord.Collection();
fs.readdirSync('./commands').forEach(folder => {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
});

client.once('ready', () => {
    console.log(`Successfully logged in as ${client.user.username} - ${client.user.id}\nServing ${client.guilds.cache.size} guilds\nPrefix: ${config.prefix}`);
    if (process.env.BOT_TOKEN) client.channels.cache.get(config.errorChannel).send(`${config.devs.map(id => client.users.cache.get(id)).join(' ')}I successfully rebooted!`);

    // Fetch message for Reaction Roles to make sure it's being watched
    client.channels.cache.get('677222279813398529').messages.fetch('677222645292597266');

});

client.on('message', message => {
    if (message.guild)
        if (!message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) return;
    if (message.author.bot)
        return;
    if (config.blockedChannels.includes(message.channel.id))
        return;
    if (message.mentions.has(client.user))
        message.channel.send(`**Prefix:** ${config.prefix}\nFor a list of commands, type \`${config.prefix}help\``);
    if (!message.content.startsWith(config.prefix))
        return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;
    if (command.developersOnly && !config.developers.includes(message.author.id)) return;
    if (command.guildOnly && !message.guild)
        return functions.errorMessage(message, 'This command can only be used on a server!');
    if (command.memberPermission && !message.channel.permissionsFor(message.member).has(command.memberPermission))
        return functions.errorMessage(message, `You cannot use this command as it requires you to have the \`${command.memberPermission}\` Permission!`);
    if (command.botPermission && !message.channel.permissionsFor(message.guild.me).has(command.botPermission))
        return functions.errorMessage(message, `I require the \`${command.botPermission}\` Permission to do this!`);
    if (command.args && !args.length)
        return functions.errorMessage(message, `Missing input. Please refer to the \`${config.prefix}help ${command.name}\` page.`);

    try {
        command.execute(message, args);
    } catch (error) {
        functions.logError(error, client);
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channel.id !== '677222279813398529' || reaction.message.id !== '677222645292597266')
        return;
    let role;
    // Weeber
    if (reaction.emoji.id === '651054603793858561')
        role = '650741600846217217';
    // Mc Gamer
    else if (reaction.emoji.id === '361948780926337036')
        role = '682204644268703746';
    if (!role)
        return;

    const member = reaction.message.guild.members.cache.get(user.id);
    if (member.roles.cache.has.role)
        return;
    member.roles.add(role);
    user.send(`Successfully added the role \`${role.name}\``);
});

client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channel.id !== '677222279813398529' || reaction.message.id !== '677222645292597266')
        return;
    let role;
    if (reaction.emoji.id === '651054603793858561')
        role = '650741600846217217';
    else if (reaction.emoji.id === '361948780926337036')
        role = '682204644268703746';
    if (!role)
        return;

    const member = reaction.message.guild.members.cache.get(user.id);
    if (!member.roles.cache.has.role)
        return;
    member.roles.remove(role);
    user.send(`Successfully removed the role \`${role.name}\``);
});

client.on('error', error => {
    functions.logError(error, client);
});
client.on('warn', warn => {
    functions.logError(warn, client);
});

setInterval(() => {
    functions.uncolour(client);
}, 1000 * 60 * 5);

client.login(process.env.BOT_TOKEN || config.token);
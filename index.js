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
    for (const i in config.reactionRoles) {
        const entry = config.reactionRoles[i];
        const channel = client.channels.cache.get(entry.channelId);
        for (const j in entry.messages)
            channel.messages.fetch(entry.messages[j].messageId);
    }

});

client.on('message', message => {
    if (message.guild && !message.channel.permissionsFor(message.guild.me).has('SEND_MESSAGES'))
        return;
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
    const entry = config.reactionRoles.filter(channel => channel.channelId === reaction.message.channel.id);
    if (!entry.length)
        return;
    const msgEntry = entry[0].messages.filter(msg => msg.messageId === reaction.message.id);
    if (!msgEntry.length)
        return;
    const reactionEntry = msgEntry[0].reactions.filter(react => react.emojiId === reaction.emoji.id);
    if (!reactionEntry.length)
        return;
    const role = reaction.message.guild.roles.cache.get(reactionEntry[0].roleId);
    if (!role)
        return;
    const member = reaction.message.guild.members.cache.get(user.id);
    member.roles.add(role);
    user.send(`Successfully added the \`${role.name}\` Role on ${reaction.message.guild.name}!`)
        .catch(() => {
            // This error is due to the user not allowing private messages, no reason to do anything with it.
            return;
        });
});

client.on('messageReactionRemove', (reaction, user) => {
    const entry = config.reactionRoles.filter(channel => channel.channelId === reaction.message.channel.id);
    if (!entry.length)
        return;
    const msgEntry = entry[0].messages.filter(msg => msg.messageId === reaction.message.id);
    if (!msgEntry.length)
        return;
    const reactionEntry = msgEntry[0].reactions.filter(react => react.emojiId === reaction.emoji.id);
    if (!reactionEntry.length)
        return;
    const role = reaction.message.guild.roles.cache.get(reactionEntry[0].roleId);
    if (!role)
        return;
    const member = reaction.message.guild.members.cache.get(user.id);
    member.roles.remove(role);
    user.send(`Successfully removed the \`${role.name}\` Role on ${reaction.message.guild.name}!`)
        .catch(() => {
            // This error is due to the user not allowing private messages, no reason to do anything with it.
            return;
        });
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
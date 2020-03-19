const config = require('config');
const Discord = require('discord.js');

module.exports = {
    async errorMessage(message, text) {
        const msg = await message.reply(text);
        msg.delete({ timeout: 3000 });
        message.delete({ timeout: 3000 });
    },
    logError(err, client) {
        client.channels.cache.get(config.errorChannel).send(config.developers.map(id => client.users.cache.get(id)).join(' ') + '\n```' + err.stack + '```');
        console.error(err);
    },
    newEmbed() {
        return new Discord.MessageEmbed().setTimestamp().setColor(Math.random().toString(16).slice(2, 8).toUpperCase());
    },
    msToHuman(ms) {
        const seconds = (ms / 1000).toFixed(1),
            minutes = (ms / (1000 * 60)).toFixed(1),
            hours = (ms / (1000 * 60 * 60)).toFixed(1),
            days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
        if (seconds < 60)
            return seconds + 's';
        else if (minutes < 60)
            return minutes + 'm';
        else if (hours < 24)
            return hours + 'h';
        else
            return days + 'd';
    },
    numToMonth(i) {
        return [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ][i - 1];
    },
    getRole(message, args, spot) {
        return message.mentions.roles.first()
            || message.guild.roles.cache.get(args[spot].replace(/[^0-9]/gi, ''))
            || message.guild.roles.cache.find(role => role.name.toLowerCase().startsWith(args[spot].toLowerCase()))
            || false;
    },
    getMember(message, args, spot) {
        return message.mentions.members.first()
            || message.guild.members.cache.get(args[spot].replace(/[^0-9]/gi, ''))
            || message.guild.members.cache.find(member => member.user.username.toLowerCase().startsWith(args[spot].toLowerCase()))
            || false;
    },
    uncolour(client) {
        const guild = client.guilds.cache.get(config.guildId);
        guild.roles.cache.filter(role => role.name.endsWith('-CC')).forEach(role => {
            if (!role.members.size)
                return role.delete();
            else if (!role.members.filter(member => member.roles.cache.some(r => r.name === 'Nitro Booster')).size) {
                client.channels.cache.get(config.logChannel).send(`Removed the Colour roles from ${role.members.map(m => m)}`);
                role.delete();
            }
        });
    },
    handleResponse(response) {
        return response.json().then(function (json) {
            return response.ok ? json : Promise.reject(json);
        });
    },

};
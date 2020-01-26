const { logchannel } = require('config')
module.exports = {
    name: 'uncolour',
    description: 'Shuts down the bot. Bot Owner only.',
    usage: ' ',
    aliases: ['die', 'kys'],
    guildonly: false,
    devonly: true,
    args: false,
    modCommand: false,
    category: 'Dev',
    execute(message, args) {
        const guild = message.client.guilds.get('328493314485518336')
        const colorRoles = []
        const victims = []
        guild.roles.forEach(role => {
            if (role.name.endsWith('-CC'))
                colorRoles.push(role)
        })
        colorRoles.forEach(role => {
            if (!role.members.size) return role.delete();
            role.members.forEach(member => {
                if (!member.roles.find(r => r.name === "Nitro Booster")) role.delete(); victims.push(member.user.tag)
            })

        })
        const output = victims.size ? `Removed the Colour Role(s) from ${victims.join(', ')}` : 'Noone new removed their boost!'
        console.log(output)
        message.client.channels.get(logchannel).send(output)
        message.reply(output).then(message => message.delete(3000))
    },
};
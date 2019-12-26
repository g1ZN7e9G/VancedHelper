module.exports = {
	name: 'rolemembers',
    description: 'Should be obvious.',
    args: false,
    usage: '',
    aliases: ['rm'], 
	execute(message, args) {
        if (!message.member.roles.some(r => r.id === adminid) && message.author.id != '265560538937819137') return
        const role = message.guild.roles.find(role => role.name.toLowerCase() === args.join(' ').toLowerCase())
        if(!role) return message.channel.send('Sorry I couldn\'t find that role.')
        const roleMembers = role.members.map(m=>m.user.tag).join('\n')
        return message.channel.send(roleMembers).catch(() => { return message.channel.send('ERROR - Probaby too many role members') })
    },
};
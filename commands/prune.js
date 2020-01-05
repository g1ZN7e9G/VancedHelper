module.exports = {
	name: 'prune',
    description: 'Prunes {x} messages. Default is 20.',
    usage: '<amount>',
    aliases: ['nuke', 'clear', 'delete'],
    guildonly: true,
    devonly: false,
    args: false,
    modCommand: true,
    category: 'Mod',
	execute(message, args) {
	    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send('You require `Manage messages` permissions to use this command.');
        var amount = parseInt(args[0]);
        if(amount > 100 || amount < 1) return message.channel.send('Please provide an amount between 1 and 100.');
        if(isNaN(amount)) amount = 20;
        message.channel.bulkDelete(amount, true)
        .then(() => {
            message.channel.send(`Successfully deleted ${amount} messages.`).then(msg => msg.delete(3000));
          })
        .catch(err => {
            console.error(err);
            message.channel.send('Oops, something went wrong! Make sure I have permissions to **Manage Messages**!').then(msg => msg.delete(3000));
        })
        
    },
};

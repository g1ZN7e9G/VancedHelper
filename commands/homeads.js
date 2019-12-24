const Discord = require('discord.js');
module.exports = {
	name: 'homeads',
    description: 'Are you getting weird home ads? This might help.',
    usage: ' ',
    aliases: ['ads', 'ha'],
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .addField('Lucky Patcher', `In case you are rooted, you can simply use Lucky Patcher to remove the ads.
                                    Just patch Vanced and select "Remove Google ads".`, false)
        .addField('VPN', `This is very inconvenient and a bit extreme for only home ads, but a working solution.
                        Setting your location to any location that doesn't have home ads (such as Finland) will solve the problem.`, false)
        .setThumbnail('https://i.imgur.com/TXiSaeI.png')
        .setTitle('Home Ads')
        .setDescription(`You might be getting ads on your home feed.
                        No, these aren't placed there by the Vanced Devs to make a quick buck.
                        Youtube somehow detects that Vanced blocks ads and thus gives you extra ads which are based on your region. 
                        Sadly, the devs have yet to find a fix for this. However there are some ways for you to solve them.`)
        .setTimestamp()
        return message.channel.send(output)
    },
};
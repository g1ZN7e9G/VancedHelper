const Discord = require('discord.js');
module.exports = {
	name: 'infiniteloading',
    description: 'Is your vanced stuck in a loading screen? This will help.',
    usage: ' ',
    aliases: ['stuck', 'loading', 'inf'],
	execute(message, args) {
        const output = new Discord.RichEmbed()
        .setColor('e5460e')
        .addField('Stock Android (or close to it)',
                  `Open your settings app and navigate to \`\`\`Apps & Notifications > See all apps > Youtube Vanced > Battery > Battery Optimisation > Dropdown menu > All apps\`\`\`locate Vanced MicroG and Youtbe Vanced and set both to "Don't optimise".`,
                  false)
        .addField('If the above doesn\'t work for you',
                  'Due to the many different Android Roms, this varies. [Visit this site](https://dontkillmyapp.com/), navigate to your vendor and follow the guide.',
                  false)
        .setTitle('Smartphones are turning back into dumbphones')
        .setDescription(`To squeeze a little extra battery out of your phone, Vendors implement aggresive Battery savers that kill tasks.\n` +
                        `MicroG was killed by your battery saver. That's why Vanced is stuck. To solve this issue, follow the guide below.`)
        .setTimestamp()
        return message.channel.send(output)
    },
};  
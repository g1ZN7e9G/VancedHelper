const functions = require('../functions.js')
module.exports = {
    name: 'infiniteloading',
    description: 'Is your vanced stuck in a loading screen? This will help.',
    usage: ' ',
    aliases: ['stuck', 'loading', 'inf'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message, args) {
        const output = functions.newEmbed()
            .addField('Stock Android (or close to it)',
                `Open your settings app and navigate to \`\`\`Apps & Notifications > See all apps > Vanced Microg > Battery > Battery Optimisation > Dropdown menu > All apps\`\`\`locate Vanced MicroG and set it to "Don't optimise", then reboot.\nIf the issue still persists, do the same for Youtube Vanced.`,
                false)
            .addField('If the above doesn\'t work for you',
                'Due to the many different Android Roms, this varies. [Visit this site](https://dontkillmyapp.com/), navigate to your vendor and follow the guide.',
                false)
            .setTitle('Smartphones are turning back into dumbphones')
            .setDescription(`To squeeze a little extra battery out of your phone, Vendors implement aggresive Battery savers that kill tasks.\n` +
                `MicroG was killed by your battery saver. That's why Vanced is stuck. To solve this issue, follow the guide below.`)

        return message.channel.send(output)
    },
};  
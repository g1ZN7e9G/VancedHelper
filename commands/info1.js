const functions = require('../functions.js')
const Discord = require('discord.js')
module.exports = {
    name: 'info1',
    description: '',
    usage: '',
    aliases: [],
    guildonly: false,
    devonly: true,
    args: false,
    modCommand: false,
    category: 'Dev',
    async execute(message, args) {
        const output = new Discord.RichEmbed()
            .addField('Rules', '`-` Read the [XDA thread](https://forum.xda-developers.com/android/apps-games/app-youtube-vanced-edition-t3758757) and do a search there before posting any questions here or in the thread.\n`-` Remember to play it nice and post in the correct channels. Read the channel topic if you aren\'t sure.\n`-` No spamming\n`-` No Advertising\n`-` Mild profanity is okay, but absolutely no racism or insulting others.', false)
            .setTitle("Welcome to YouTube Vanced's Discord channel")
            .setDescription("Please read these rules so everyone can have a nice time. We really don't have a lot of rules, so at least follow these.")
            .setImage('https://i.imgur.com/KIpXxCb.png')
            .setColor('00d084')

        await message.channel.send(output)

        const output2 = new Discord.RichEmbed()
            .setTitle("Official Platforms")
            .setDescription("You can find all official sites, platforms and chats below. For your own safety, do not use any other sites that claim to be official.")
            .addField('Official Website', '[vanced.app](https://vanced.app)')
            .addField('XDA Developers', '[Vanced XDA Thread](https://forum.xda-developers.com/android/apps-games/app-youtube-vanced-edition-t3758757)')
            .addField('Telegram', '[Main Group](https://t.me/joinchat/AAAAAEHf-pi4jH1SDlAL4w)\n[Offtopic Group](https://t.me/joinchat/GpIQTFJT4SlFh-K1Zkgsfw)')
            .addField('OneSky', '[Help translate Vanced to your language](https://vanced.oneskyapp.com/collaboration/project/302988)')
            .addField('Discord', "You're on it silly! For a permanent invite, scroll up in this chat.\nYou can find all latest apk downloads in <#517803059821281280>")
            .addField('Reddit', '[r/vanced](https://www.reddit.com/r/vanced)')
            .addField('Twitter', '[@YTVanced](https://twitter.com/YTVanced) (Mainly for memes)')
            .addField('Instagram', '[vanced.youtube](https://www.instagram.com/vanced.youtube/) (Mainly for memes)')
            .addField('Brave Browser', "If you like Brave Browser or want to give it a try, [install it via our referral link](https://vanced.app/brave)<:clownbrowser:655553193824092160>")
            .setColor('00d084')

        await message.channel.send(output2)

        const output3 = new Discord.RichEmbed()
            .setTitle('Get Help')
            .setDescription('Answering the same question 20 times a day is annoying.\nBefore asking for support or sending a bug report, please check out our bot <@658352336787472386> as it has a lot of info and bugfixes. Simply head over to <#361807727531393026> and type `-help` to get a list of all available commands.')
            .addField('Get Support', 'Describe your issue as detailed as possible in <#358967876193091584>. Also attach a screenshot.\nPlease refrain from pinging or dming random users.')
            .addField('Provide Feedback', 'To get instructions on how to report a bug or send a suggestion, read <#663348498389008384> closely.')
            .addField('Are you an advanced user?', "[Apply for tester!](https://discordapp.com/channels/328493314485518336/677250253484720141/677250820722393088) (If the link doesn't work for you, just go to the last pinned message in <#677250253484720141>.")
            .setColor('00d084')

        await message.channel.send(output3)
    },
};
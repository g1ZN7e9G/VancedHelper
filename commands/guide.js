const functions = require('../functions.js')
module.exports = {
    name: 'installguide',
    description: 'Guide for Installing YouTube Vanced',
    usage: ' ',
    aliases: ['install', 'ig', 'g', 'guide'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message, args) {
        const output = functions.newEmbed()
            .addField('For non-root users:', 
                `First of all, you will need to download MicroG from [here](https://vanced.app) \nonce you install it, follow these steps:\n 1) Download SAI from Google Play Store\n 2) open SAI and press \`Install APKS\`\n 3) navigate to folder where you have Vanced.apks saved (by default It's Download/Downloads folder).\n 4) choose .apks file and wait till it prompts you to install, press 'install' button and wait untill it's done`, false)
            .addField('For root users:',
                `For this method, you will need to have root access.\n 1) Download SAI from Google Play Store\n 2) open SAI and navigate to settings menu\n 3) Scroll down and under \'Installation Method\' and choose root method\n 4) Go to main menu and select 'Install apks' \n 5) navigate to a folder where you have Vanced.apks saved (by default It's Download/Downloads folder) and press install.`, false)
            .addField('Important notice for MiUI users!',
                `Due to some MiUI limitations, you may get errors while installing Vanced using SAI, in order to solve this problem, you have to:\n 1) Enable Developer Options\n 2) Scroll down until you see \`Turn on MiUI optimization\` and disable it\n 3) Use SAI to install Vanced`, false)
            .addField('Alternative Method',
                'As an alternative, you can install Vanced using ADB. Here\'s how to do it:' + 
                `\n 1) Download the apks file\n 2) Extract the .apks file (it's just a zip)\n 3) Rename the YouTube_15.05.54_API21(nodpi)(vBlack-v2.1.0)-vanced.apk to vanced.apk\n 4) Run this command while connected to your phone:\`\`\`adb install-multiple vanced.apk config.arm64_v8a.apk split_config.en.apk\`\`\`If you want to install a language other than english, add it at the end of the command (for example split_config.de.apk)\nIf you're on legacy, you have to adjust the second filename\n 5) Install MicroG manually on your phone`, false)
            .addField('Now you know how to install Vanced', 'Good Luck!')
            .setTitle('How to install new versions of YouTube Vanced')
            .setDescription(`Because of how YouTube's new APK is being handled, We use Split APKS.\n` + `In order to install Vanced, you'll need to use SAI (Split Apks Installer).` + `\nDownload SAI from [here](https://play.google.com/store/apps/details?id=com.aefyr.sai)`)

        return message.channel.send(output)
    },
};

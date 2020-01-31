const functions = require('../functions.js')
module.exports = {
    name: 'logcat',
    description: 'Guide on how to use logcat to properly report bugs.',
    usage: '',
    aliases: ['log', 'dumpsys'],
    guildonly: false,
    devonly: false,
    args: false,
    modCommand: false,
    category: 'Vanced',
    execute(message, args) {
        const output = functions.newEmbed()
            .addField('On your Phone',
                ':one: Open your settings app and go to `About Phone/Phone Info` and click your build number 7 times.\n:two: Now go back to the settings main menu.\n:three: You will now either have a new tab `Developer Options` in this menu or in the system menu.\n:four: Open Developer Options and enable `USB-Debugging`.',
                false)
            .addField('On your PC/Laptop',
                ':one: [Visit this website](https://developer.android.com/studio/releases/platform-tools) and download the tools for your operating system.\n:two: Extract them.\n:three: Open the extracted folder to find many `.exe` files.\n:four: `Shift + Rightclick` the background of the extracted folder and select `Run command prompt/powershell here`.\n:five: Plug your phone into your PC, unlock it and grant USB-Debugging Permission.\n:six:Type `adb devices`. If your phone is shown, proceed. If not, google for `[yourBrandHere] usb drivers` and install them.\n:seven: Type `adb logcat -c`, then `adb logcat *:W > logcat.txt`.\n:eight: Open your Vanced, cause your bug and then close the command prompt.\n:nine: Now you will find a new file `logcat.txt` in the folder. Open it, scan it quickly to remove confidential info, press `CTRL + A` => `CTRL + C`, open https://hastebin.com/, paste it and save. Use the output link for your bug report.',
                false)
            //.setThumbnail('')
            .setTitle('How to logcat')
            .setDescription('A logcat is a log of all processes on your system. This helps a lot with identifying the problem. This is however a bit inconvenient and requires a pc. Please follow this guide to create a logcat.')

        return message.channel.send(output)
    },
};
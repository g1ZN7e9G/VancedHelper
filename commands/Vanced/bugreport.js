const functions = require('../../utils/functions.js');
const config = require('config');
module.exports = {
  name: 'bugreport',
  description: 'Learn how to report bugs',
  usage: `to view index or jump directly to specific page via ${config.prefix}bugreport [from 1 to 3] `,
  aliases: ['bug', 'report', 'br'],
  guildonly: false,
  developersOnly: false,
  args: false,
  modCommand: false,
  category: 'Vanced',
  async execute(message, args) {
    const pages = [];
    pages.push(
      functions.newEmbed()
        .setTitle('How to report bugs')
        .setDescription(
          `Review the table of contents below and jump to the page you need via reactions or by typing \`${functions.prefix}bugreport [page number].\``
        )
        .addField('Table of Contents', ':one: - `Index`\n:two: - `Report a regular bug`\n:three: - `Report a theme bug`\n\n\n:arrow_down: - Page Indicator'
        )
        .setFooter('1/3')
    );
    pages.push(
      functions.newEmbed()
        .addFields([
          {
            name: 'On your Phone',
            value: ':one: Open your settings app and go to `About Phone/Phone Info` and click your build number 7 times.\n:two: Now go back to the settings main menu.\n:three: You will now either have a new tab `Developer Options` in this menu or in the system menu.\n:four: Open Developer Options and enable `USB-Debugging`.'
          },
          {
            name: 'On your PC/Laptop',
            value: ':one: [Visit this website](https://developer.android.com/studio/releases/platform-tools) and download the tools for your operating system.\n:two: Extract them.\n:three: Open the extracted folder to find many `.exe` files.\n:four: `Shift + Rightclick` the background of the extracted folder and select `Run command prompt/powershell here`.\n:five: Plug your phone into your PC, unlock it and grant USB-Debugging Permission.\n:six: Type `adb devices`. If your phone is shown, proceed. If not, google for `[yourBrandHere] usb drivers` and install them.\n:seven: Type `adb logcat -c`, then `adb logcat *:W > logcat.txt`.\n:eight: Open your Vanced, cause your bug and then close the command prompt.\n:nine: Now you will find a new file `logcat.txt` in the folder. Open it, scan it quickly to remove confidential info, press `CTRL + A` => `CTRL + C`, open https://hastebin.com/, paste it and save. Use the output link for your bug report.'
          }
        ])
        .setTitle('How to report a regular bug')
        .setDescription(
          "Modifying an app is not an easy job, sometimes applying a modification can cause some minor bugs and we can't catch them. That's where you come in!  If you experience a bug and want to help us improve Vanced, you need to provide a `logcat`. " +
          'A logcat is a log of all processes on your system. This helps a lot with identifying the problem. This is however a bit inconvenient and requires a pc. Please follow this guide to create a logcat.'
        )
        .setFooter('2/3')
    );
    pages.push(
      functions.newEmbed()
        .addFields([
          {
            name: 'Before you continue',
            value: "Please read info in <#663348498389008384> to completely understand how to report a bug, otherwise your report won't be viewed. Don't forget to check <#663158441879142410> to see if your bug has already been reported"
          },
          {
            name: "Let's get started",
            value: 'After you have downloaded `Developer Assistant`, open Vanced and find the bug, then open layoutviewer by holding down home button until the app launches.' +
              " Now follow these steps:\n:one: Make sure the bug you're experiencing is on the screen\n:two: Tap on the element that you think is affected by a bug\n:three: Go to `Element` and `Hierarchy` tabs and screenshot the output\n:four: Now head over to <#663170881572438036> and report them"
          },
          {
            name: 'When will my bug be reviewed?',
            value: 'Your feedback will be reviewed as soon as possible. This should ususally not take lonegr than 6 hours. Thanks for understanding!'
          }
        ])
        .setTitle('How to report Theme bugs')
        .setDescription('This guide will show you how to report Theme based bugs.\nIn order to report bugs, you will need [Developer Assistant](https://play.google.com/store/apps/details?id=com.appsisle.developerassistant)'
        )
        .setFooter('3/3')
    );

    let page = isNaN(parseInt(args[0])) || parseInt(args[0]) > pages.length || parseInt(args[0]) <= 0 ? 0 : parseInt(args[0]) - 1;
    page = page > pages.length ? 0 : page;
    if (page > 0)
      return message.channel.send(pages[page]);

    const msg = await message.channel.send(pages[page]);

    await msg.react('⬅️');
    await msg.react('➡️');

    const collector = msg.createReactionCollector((_reaction, user) => user.id === message.author.id, { time: 1000 * 60 * 5 });

    collector.on('collect', r => {
      r.users.cache.filter(user => user.id !== message.client.user.id).forEach(user => r.users.remove(user));
      switch (r.emoji.name) {
        case '⬅️':
          if (page === 0) return;
          page--;
          msg.edit(pages[page]);
          break;
        case '➡️':
          if (page + 1 === pages.length) return;
          page++;
          msg.edit(pages[page]);
          break;
      }
    });
    collector.on('end', () => {
      msg.reactions.removeAll();
    });
  }
};

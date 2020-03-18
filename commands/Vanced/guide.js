const functions = require('../../utils/functions.js');
const config = require('config');
module.exports = {
  name: 'guide',
  description: 'Learn how to install and use Vanced',
  usage: `to view index or jump directly to specific page via ${config.prefix}guide [page number from 1 to 6] `,
  aliases: ['install', 'howtoinstall', 'installguide', 'ig'],
  guildonly: false,
  devonly: false,
  args: false,
  modCommand: false,
  category: 'Vanced',
  async execute(message, args) {
    const pages = [];
    pages.push(
      functions.newEmbed()
        .setTitle('Installation Guide')
        .setDescription(`Review the table of contents below and jump to the page you need via reactions or by typing \`${functions.prefix}guide [page number].\``)
        .addField('Table of Contents', ':one: - `Index`\n:two: - `How to download Vanced`\n:three: - `Non-Root Guide`\n:four: - `Root Guide - Disabling Signature Verification`\n:five: - `Root Guide - Installing Vanced`\n:six: - `Alternative Installation Method`\n\n:arrow_down: - Page Indicator')
        .setFooter('1/6')
    );

    pages.push(
      functions.newEmbed()
        .setTitle('How to Download Vanced')
        .addField([
          {
            name: 'Which one should I pick?',
            value: "- First thing you'll see is an option to select either nonroot or root variants. if you didn't root your device, simply select the nonroot version\n - Now you'll have to select either default or legacy variant. Default is for newer devices with arm64 chips, which were released after 2016. Legacy variant is for older/slower devices with arm chips. (If your phone has an arm64 chip but kernel instructions are set to 32-bit, you'll have to download a Legacy version.)\n - Finally you'll have to select either dark or black variant. Dark variant has Dark theme like we've seen in stock YT app, while Black variant has an AMOLED Black theme.\nSelect your favorite one and download it.\n\n__IMPORTANT__\nTo be able to use Vanced on nonroot devices, you'll need to download and install Microg from the same website.\n\nNow follow the instructions on next pages"
          },
          { name: 'Note:', value: 'If downloaded files have .bin extension, simply rename them to `.apks` (not .apk) and continue to next pages' }
        ])
        .setDescription('In order to install Vanced, you\'ll need to download it first.\nGo to [vanced.app](https://vanced.app) and scroll down. Here you\'ll see different buttons which you can select.')
        .setFooter('2/6')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Non-Root Guide')
        .addField('For non-root users:', "Before continuing, make sure you have followed instructions on previous page\n :one: Download SAI from Google Play Store\n :two: Open SAI and press `Install APKS`\n :three: Navigate to folder where you have Vanced.apks saved (by default this is Download/Downloads folder).\n :four: Choose .apks file and wait till it prompts you to install, press 'install' button and wait until it's done")
        .setFooter('3/6')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Root Guide - Disabling Signature Verification')
        .setDescription(
          'To be able to Install Vanced on rooted devices, first you need to have Signature Verification disabled.\nThis guide will show you 2 methods of disabling signature verification'
        )
        .addFields([
          {
            name: 'Using *Yellow Man* (Lucky Patcher)',
            value: "In order to disable Signature Verification using Lucky Patcher, you need to follow the steps bellow:\n :one: Open Lucky Patcher\n :two: Navigate to `toolbox`\n :three: Choose `Patch to Android`\n :four: Select `Disable .apk signature verification`\n :five: Press `Apply`\nNote: Your device may suddenly reboot, this is normal and that's how patching dalvik-cache works"
          },
          {
            name: 'Using an (Ed)Xposed module',
            value: "Use this if LP method doesn't work.\n :one: Open (Ed)Xposed Installer\n :two: Navigate to `Download` section\n :three: Download and Install `DSV` module\n :four: Activate module and Restart"
          },
          {
            name: 'Warning',
            value: "After you're done installing Vanced, we highly recommend you re-enable signature verification as having it disabled is a security risk"
          }
        ])
        .setFooter('4/6')
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle('Root Guide - Installing Vanced')
        .addField('Installation', 'For this method, you will need to disable Signature Verification (See previous page).\n :one: Download SAI from Google Play Store\n :two: Open SAI and navigate to settings menu\n :three: Scroll down and under \'Installation Method\' choose root method\n :four: Go to main menu and select \'Install apks\' \n :five: Navigate to the folder where you have Vanced.apks saved (by default this is Download/Downloads folder) and press install.')
        .setFooter('5/6')
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle('Alternative Installation Method')
        .addField('You can install Vanced using ADB too', 'You will need [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) for this method.\n :one: Download the apks file\n :two: Extract the .apks file (it\'s just a zip)\n :three: Rename the YouTube_15.05.54_API21(nodpi)(vBlack-v2.1.0)-vanced.apk to vanced.apk\n :four: Run this command while connected to your phone:```adb install-multiple vanced.apk config.arm64_v8a.apk split_config.en.apk```If you want to install a language other than english, add it at the end of the command (for example split_config.de.apk)\nIf you\'re on legacy, you have to adjust the second filename\n :five: Install MicroG manually on your phone')
        .setFooter('6/6')
    );
    let page = isNaN(parseInt(args[0])) || parseInt(args[0]) > pages.length || parseInt(args[0]) <= 0 ? 0 : parseInt(args[0]) - 1;
    page = page > pages.length ? 0 : page;
    if (page > 0) return message.channel.send(pages[page]);
    const msg = await message.channel.send(pages[page]);

    await msg.react('⏪');
    await msg.react('⬅️');
    await msg.react('➡️');
    await msg.react('⏩');

    const collector = msg.createReactionCollector((_reaction, user) => user.id === message.author.id, { time: 1000 * 60 * 5 });

    collector.on('collect', r => {
      r.users.cache.filter(user => user.id !== message.client.user.id).forEach(user => r.users.remove(user));
      switch (r.emoji.name) {
        case '⏪':
          if (page === 0) return;
          page = 0;
          msg.edit(pages[page]);
          break;
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
        case '⏩':
          if (page + 1 === pages.length) return;
          page = pages.length - 1;
          msg.edit(pages[page]);
          break;
        default:
          break;
      }
    });
    collector.on('end', () => {
      msg.reactions.forEach(r => r.users.forEach(user => r.remove(user)));
    });
  }
};

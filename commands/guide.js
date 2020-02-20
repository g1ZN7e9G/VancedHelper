const functions = require("../functions.js");
module.exports = {
  name: "guide",
  description: "Learn how to install Vanced",
  usage: " ",
  aliases: ["install", "howtoinstall", "installguide", "ig"],
  guildonly: false,
  devonly: false,
  args: false,
  modCommand: false,
  category: "Vanced",
  async execute(message, args) {
    const pages = [];
    let page = 0;
    pages.push(
      functions
        .newEmbed()
        .setTitle("Install Guide")
        .setDescription(
          "Review the list of context below and jump to the page you need via reactions."
        )
        .addField(
          "Table of Contents",
          "**Page 1:** `Index`\n**Page 2:** `What in the world is an.apks file?`\n**Page 3:** `Non-Root Guide`\n**Page 4:** `Root Guide - Disabling Signature Verification`\n**Page 5:** `Root Guide - Installing Vanced`\n**Page 6:** `Alternative Installation Method`\n**Page 7:** `Important Notes`"
        )
        .setFooter("1/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Why do we use new .apks format?")
        .setDescription(
          `Because of how YouTube's new APK is being handled, We use Split APKS.\n` +
            `In order to install Vanced, you'll need to use SAI (Split Apks Installer).` +
            `\nDownload SAI from [here](https://play.google.com/store/apps/details?id=com.aefyr.sai)`
        )
        .setFooter("2/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Non-Root Guide")
        .addField(
          "For non-root users:",
          `First of all, you will need to download MicroG from [here](https://vanced.app) \nonce you install it, follow these steps:\n 1) Download SAI from Google Play Store\n 2) open SAI and press \`Install APKS\`\n 3) navigate to folder where you have Vanced.apks saved (by default It's Download/Downloads folder).\n 4) choose .apks file and wait till it prompts you to install, press 'install' button and wait until it's done`,
          false
        )
        .setFooter("3/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Root Guide - Disable Signature Verification")
        .setDescription(
          "To be able to Install Vanced on rooted devices, first you need to have Signature Verification disabled.\nThis guide will show you 2 methods of disabling signature verification"
        )
        .addField(
          "Using *Yellow Man* (Lucky Patcher)",
          "In order to disable Signature Verification using Lucky Patcher, you need to follow the steps bellow:\n 1) Open Lucky Patcher\n 2) Navigate to `toolbox`\n 3) choose `Patch to Android`\n 4) select `Disable .apk signature verification`\n 5) press `Apply`\nNote: your device may suddenly reboot, this is normal and that' how patching dalvik-cache works",
          false
        )
        .addField(
          "Using an (Ed)Xposed module",
          "Use this if LP method doesn't work.\n 1) Open (Ed)Xposed Installer\n 2) Navigate to `Download` section\n 3) Download and Install `DSV` module\n 4) Activate module and Restart",
          false
        )
        .addField(
          "Warning",
          "After you've completed operation that required you to disable Signature Verification, Please re-enable it as it decreases your device's security.",
          false
        )
        .setFooter("4/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Root Guide - Installing Vanced")
        .addField(
          "Installation",
          `For this method, you will need to disable Signature Verification (See previous page).\n 1) Download SAI from Google Play Store\n 2) open SAI and navigate to settings menu\n 3) Scroll down and under \'Installation Method\' and choose root method\n 4) Go to main menu and select 'Install apks' \n 5) navigate to a folder where you have Vanced.apks saved (by default It's Download/Downloads folder) and press install.`,
          false
        )
        .setFooter("5/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Alternative Installation Method")
        .addField(
          "You can install Vanced using ADB too",
          `You will need [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) for this method.\n 1) Download the apks file\n 2) Extract the .apks file (it's just a zip)\n 3) Rename the YouTube_15.05.54_API21(nodpi)(vBlack-v2.1.0)-vanced.apk to vanced.apk\n 4) Run this command while connected to your phone:\`\`\`adb install-multiple vanced.apk config.arm64_v8a.apk split_config.en.apk\`\`\`If you want to install a language other than english, add it at the end of the command (for example split_config.de.apk)\nIf you're on legacy, you have to adjust the second filename\n 5) Install MicroG manually on your phone`,
          false
        )
        .setFooter("6/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Important Notes")
        .addField(
          "Notice for MiUI users!",
          `Due to some MiUI limitations, you may get errors while installing Vanced using SAI, in order to solve this problem, you have to:\n 1) Enable Developer Options\n 2) Scroll down until you see \`Turn on MiUI optimization\` and disable it\n 3) Use SAI to install Vanced`,
          false
        )
        .setFooter("7/7")
    );
    const msg = await message.channel.send(pages[0]);
    await msg.react("⬅️");
    await msg.react("➡️");

    const collector = msg.createReactionCollector(
      (reaction, user) => user.id === message.author.id,
      { time: 1000 * 60 * 5 }
    );
    const spam = msg.createReactionCollector(
      (reaction, user) => user.id !== message.author.id,
      { time: 1000 * 60 * 5 }
    );

    spam.on("collect", r => {
      r.users
        .filter(user => user.id !== message.client.user.id)
        .forEach(user => r.remove(user));
    });
    collector.on("collect", r => {
      r.users
        .filter(user => user.id !== message.client.user.id)
        .forEach(user => r.remove(user));
      switch (r.emoji.name) {
        case "⬅️":
          if (page === 0) return;
          page--;
          msg.edit(pages[page]);
          break;
        case "➡️":
          if (page + 1 === pages.length) return;
          page++;
          msg.edit(pages[page]);
          break;
        default:
          break;
      }
    });
    collector.on("end", () => {
      msg.reactions.forEach(r => r.users.forEach(user => r.remove(user)));
    });
  }
};

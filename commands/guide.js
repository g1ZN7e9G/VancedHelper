const functions = require("../functions.js");
module.exports = {
  name: "guide",
  description: "Learn how to install Vanced",
  usage: `Use ${functions.prefix}guide to view index or jump directly to specific page via ${functions.prefix}guide [page number from 1 to 8] `,
  aliases: ["install", "howtoinstall", "installguide", "ig"],
  guildonly: false,
  devonly: false,
  args: false,
  modCommand: false,
  category: "Vanced",
  async execute(message, args) {
    const pages = [];
    pages.push(
      functions
        .newEmbed()
        .setTitle("Installation Guide")
        .setDescription(
          `Review the list of context below and jump to the page you need via reactions or by typing \`${functions.prefix}guide [page number].\``
        )
        .addField(
          "Table of Contents",
          ":one: - `Index`\n:two: - `What in the world is an.apks file?`\n:three: - `How to download Vanced`\n:four: - `Non-Root Guide`\n:five: - `Root Guide - Disabling Signature Verification`\n:six: - `Root Guide - Installing Vanced`\n:seven: - `Alternative Installation Method`\n:eight: - `Troubleshooting`\n\n:arrow_down: - page indicator"
        )
        .setFooter("1/8")
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
        .addField(
          "Note:",
          "It's still possible for devs to merge those APKS into one, but it's not worth the effort",
          false
        )
        .setFooter("2/8")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("How to Download Vanced")
        .addField(
          "Which one should I pick?\n",
          "- First thing you'll see is an option to select either nonroot or root variants. if you didn't root your device, simply select the nonroot version\n - Now you'll have to select either default or legacy variant. Default is for newer devices with arm64 chips, which were released after 2016. Legacy variant is for older/slower devices with arm chips. (If your phone has an arm64 chip but kernel instructions are set to 32-bit, you'll have to download a Legacy version.)\n - Finally you'll have to select either dark or black variant. Dark variant has Dark theme like we've seen in stock YT app, while Black variant has an AMOLED Black theme.\nSelect your favorite one and download it.\n\n__IMPORTANT__\nTo be able to use Vanced on nonroot devices, you'll need to download and install Microg from the same website.\n\nNow follow instructions on next pages",
          false
        )
        .setDescription(
          `In order to install Vanced, you'll need to download it first.\nGo to [vanced.app](https://vanced.app) and scroll down. Here you'll see different buttons which you can select.`
        )
        .setFooter("3/8")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Non-Root Guide")
        .addField(
          "For non-root users:",
          "Before continuing, make sure you have followed instructions on previous page\n 1) Download SAI from Google Play Store\n 2) open SAI and press `Install APKS`\n 3) navigate to folder where you have Vanced.apks saved (by default It's Download/Downloads folder).\n 4) choose .apks file and wait till it prompts you to install, press 'install' button and wait until it's done",
          false
        )
        .setFooter("4/8")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Root Guide - Disabling Signature Verification")
        .setDescription(
          "To be able to Install Vanced on rooted devices, first you need to have Signature Verification disabled.\nThis guide will show you 2 methods of disabling signature verification"
        )
        .addField(
          "Using *Yellow Man* (Lucky Patcher)",
          "In order to disable Signature Verification using Lucky Patcher, you need to follow the steps bellow:\n 1) Open Lucky Patcher\n 2) Navigate to `toolbox`\n 3) choose `Patch to Android`\n 4) select `Disable .apk signature verification`\n 5) press `Apply`\nNote: your device may suddenly reboot, this is normal and that's how patching dalvik-cache works",
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
        .setFooter("5/8")
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
        .setFooter("6/8")
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
        .setFooter("7/8")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Troubleshooting")
        .addField(
          "Notice for MiUI users!",
          `Due to some MiUI limitations, you may get errors while installing Vanced using SAI, in order to solve this problem, you have to:\n 1) Enable Developer Options\n 2) Scroll down until you see \`Turn on MiUI optimization\` and disable it\n 3) Use SAI to install Vanced`,
          false
        )
        .addField(
          "App Compatibility issue",
          `Some old devices still use old arm architecture, because of that you will get an error in SAI if you're using a default version for arm devices.\nIf you get an error that says: \`This app is incompatible with your device\`, download a \`legacy\` version from [vanced.app](https://vanced.app) and try again.`,
          false
        )
        .addField(
          "How to enable a dark splash screen?",
          "In order to enable a dark splash screen, you need to enable a system-wide dark theme in device settings, then you'll have a dark splash screen",
          false
        )
        .addField(
          "Disable 60fps playback",
          "In order to disable 60fps playback, you need to enable hidden menu in vanced settings, to do that go to vanced settings and tap on `About` field for about 6-7 times, then go to Codec menu and override model to `SM-T520`",
          false
        )
        .addField(
          "What to do if I don't get any notifications?",
          `Sometimes you may not get any notifications from your favorite YouTubers, in order to solve this problem you need to adjust some settings.\nGo to Vanced Settings, tap on Microg settings and go to \`Google Cloud Messaging\`, here set ping to 60 seconds and voilla.\nIf you still don't get any notifications, disable battery optimisation for both Microg and Vanced (see \`${functions.prefix}stuck\` for detailed guide)`,
          false
         )
        .setFooter("8/8")
    );
    let page =
      isNaN(parseInt(args[0])) ||
      parseInt(args[0]) > pages.length ||
      parseInt(args[0]) <= 0
        ? 0
        : parseInt(args[0]) - 1;
    page = page > pages.length ? 0 : page;
    const msg = await message.channel.send(pages[page]);
    await msg.react("⏪")
    await msg.react("⬅️");
    await msg.react("➡️");
    await msg.react("⏩");

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
        case "⏪":
          if (page === 0) return;
          page = 0;
          msg.edit(pages[page]);
          break;
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
        case "⏩":
          if (page + 1 === pages.length) return;
          page = pages.length - 1;
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

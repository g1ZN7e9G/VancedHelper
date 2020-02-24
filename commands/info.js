const functions = require("../functions.js");
module.exports = {
  name: "info",
  description: "Learn everything about Vanced",
  usage: `to view index or jump directly to specific page via ${functions.prefix}info [page number] `,
  aliases: ["informatin"],
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
        .setTitle("Information about Vanced")
        .setDescription(
          `Review the table of contents below and jump to the page you need via reactions or by typing \`${functions.prefix}info [page number].\``
        )
        .addField(
          "Table of Contents",
          ":one: - `Index`\n:two: - `What in the world is an.apks file?`\n:three: - `What's the latest Vanced version?`\n:four: - `Why I can't download videos?`\n:five: - `Will I get banned for using Vanced?`\n:six: - `Casting to TV`\n:seven: - `When will new update release??!`\n\n:arrow_down: - Page Indicator"
        )
        .setFooter("1/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setTitle("Why do we use new .apks format?")
        .setDescription(
          `~~What if, you wanted to go to heaven, but [vanced.app](https://vanced.app) said: \`YoU NeeD SaI To InsTAll VaNcED\`~~` +
            `\nJokes aside, because of how YouTube's new APK is being handled, we use .apks (Split apk). In order to install Vanced, you'll need to use SAI (Split Apks Installer).` +
            `\n[Download SAI](https://play.google.com/store/apps/details?id=com.aefyr.sai)`
        )
        .addField(
          "Note:",
          "It's still possible for devs to merge those APKS into one, but it's not worth the effort",
          false
        )
        .setFooter("2/7")
    );
    pages.push(
      functions
        .newEmbed()
        .addField("Youtube Vanced", "15.05.54", false)
        .addField("Vanced Microg", "0.2.6.17455-dirty", false)
        .setTitle("Latest Versions")
        .setDescription(
          `These are the latest versions. Please make sure you have these. For download links, type ${functions.prefix}download.`
        )
        .setFooter("3/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setThumbnail("https://i.imgur.com/NYmMUq5.png")
        .setTitle("Downloading Videos")
        .setDescription(
          `Downloading videos has never been and will never be a feature of Vanced. It led to the closing of many Youtube Mods in the past.\n` +
            `[In some regions](https://support.google.com/youtube/answer/6141269?co=GENIE.Platform%3DAndroid&hl=en) however, downloading is free.\n\n` +
            `For downloading, use a third party tool like [Ymusic](https://ymusic.io).`
        )
        .setFooter("4/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setImage("https://i.imgur.com/IIJcQ4Z.png")
        .setThumbnail("https://i.imgur.com/6xeelhB.png")
        .setTitle("No, you won't get banned for using Vanced.")
        .setDescription(
          `No, Youtube's new ToS do not state that your account might be removed due to not being commercially available. In other words, Youtube will not ban you for using Adblock or Vanced.\n\n` +
            `However, you  use Vanced at your own discretion. Seeing as it is an unofficial client and as we can't predict what Youtube will do in the future, there's always a very slight risk, and we can't guarantee your account's safety.`
        )
        .setFooter("5/7")
    );
    pages.push(
      functions
        .newEmbed()
        .setThumbnail("https://i.imgur.com/gvNSmzo.png")
        .setTitle("Casting to TV")
        .setDescription(
          `Casting to TV doesn't actually cast, it just makes your TV open its Youtube app and play the video there.\n` +
            `This means that casting to TV will use the standard Youtube player which has ads and lacks the Vanced modifications.\n` +
            `There's nothing Vanced can do about this and this is **not a bug**.`
        )
        .setFooter("6/7")
    );
    pages.push(
      functions
        .newEmbed()
        .addField(
          "Issues",
          "There's tons of issues that are tough to fix with the latest versions. Tons of crashes, incompatibilities, weird apk behavior, removal of ExoPlayer V2 and many more.",
          false
        )
        .addField(
          "Motivation",
          "Vanced is just a hobby, not a job. This means that updates only come when the Devs are motivated.",
          false
        )
        .addField(
          "The current version is just fine",
          "There is no issues that aren't fixable. Additionally, the new Youtube version has no new feature that would provide a good reason to even update.",
          false
        )
        .setTitle("Update when????")
        .setDescription(
          `~~Every time someone asks, you gotta wait one extra day until the next update comes out. We reached 169 extra days now.~~\n\n` +
            `Jokes aside, there are many reasons for there not to be an update. If you can't deal with it, this is not the mod for you.\n` +
            `You can find some reasons below, but please stop asking about an update.`
        )
        .setFooter("7/7")
    );
    let page =
      isNaN(parseInt(args[0])) ||
      parseInt(args[0]) > pages.length ||
      parseInt(args[0]) <= 0
        ? 0
        : parseInt(args[0]) - 1;
    page = page > pages.length ? 0 : page;
    if (page > 0) return message.channel.send(pages[page]);
    const msg = await message.channel.send(pages[page]);
    
    await msg.react("⏪");
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

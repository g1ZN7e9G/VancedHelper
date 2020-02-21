const functions = require("../functions.js");
module.exports = {
  name: "layoutviewer",
  description: "Guide for reporting bugs that depend on layout viewer",
  usage: " ",
  aliases: ["lv", "layout"],
  guildonly: false,
  devonly: false,
  args: false,
  modCommand: false,
  category: "Vanced",
  execute(message, args) {
    const output = functions
      .newEmbed()
      .addField(
        "Before you continue",
        "Please read info in <#663348498389008384> to completely understand how to report a bug, otherwise your report won't be viewed." +
          " Don't forget to check <#663158441879142410> to see if your bug has already been reported",
        false
      )
      .addField(
        "Let's get started",
        "After you have downloaded `Developer Assistant`, open Vanced and find the bug, then open layoutviewer by holding down home button until the app launches." +
          " Now follow these steps:\n 1) Make sure that bug you're experiencing is on the screen\n 2) tap on the element that you think is affected by a bug\n 3) Go to `Element` and `Hierarchy` tabs and screenshot the outputs\n 4) Now head over to <#663170881572438036> and report them"
      )
      .addField(
        "When will my bug be reviewed?",
        "We don't know when our moderators will have a free time to accept/reject bugs, please consider that ~~they're only humans~~ they have their own life and they are not robots. Thanks for understanding!"
      )
      .setTitle("How to report Theme based bugs")
      .setDescription(
        `We all know that Vanced is a good app, but nothing is perfect. Sometimes bugs just slip into the code and that\'s pretty normal. This guide will show you how to report Theme based bugs.\nIn order to report bugs, you will need [Developer Assistant](https://play.google.com/store/apps/details?id=com.appsisle.developerassistant)`
      );

    return message.channel.send(output);
  }
};

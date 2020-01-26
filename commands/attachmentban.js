const Discord = require("discord.js");
const { logchannel } = require("config");
module.exports = {
  name: "attachmentban",
  description:
    'Gives the mentioned user a role which will make them unable to attach files. Requires you to setup a role named "attachment-ban" with the right permissions.',
  usage: "[@member] <reason>",
  aliases: ["fileban", "ab"],
  guildonly: true,
  devonly: false,
  args: true,
  modCommand: true,
  category: "Mod",
  needPermission: "MANAGE_ROLES",
  execute(message, args) {
    const mod = message.author.tag;
    if (!message.member.hasPermission("MANAGE_MESSAGES"))
      return message.channel.send(
        "You require `Manage messages` permissions to use this command."
      );
    const member = message.mentions.members.first();
    if (!member)
      return message.channel.send("Please mention a member to attachment-ban.");
    var reason = [];
    if (args[1]) reason = args.slice(1).join(" ");
    else reason = "-";
    const success = new Discord.RichEmbed()
      .setColor("ff0000")
      .setTimestamp()
      .setAuthor("Attachment-Ban")
      .setDescription("User has successfully been attachment-banned!")
      .addField("User", member.user.tag, false)
      .addField("Moderator", mod, false)
      .addField("Reason", reason, false)
      .setThumbnail(member.user.avatarURL);
    member
      .addRole(message.guild.roles.find(role => role.name === "attachment-ban"))
      .then(member => {
        message.channel.send(success);
        message.client.channels.get(logchannel).send(success);
      })
      .catch(() => {
        message.channel.send(
          "Oops, something went wrong. Please make sure you got a role called `attachment-ban` set up on this server which is lower than my highest role."
        );
      });
  }
};

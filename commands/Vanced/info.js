const functions = require('../../utils/functions.js');
const config = require('config');
module.exports = {
  name: 'info',
  description: 'Learn everything about Vanced',
  usage: `to view index or jump directly to specific page via ${config.prefix}info [page number] `,
  aliases: ['informatin'],
  guildonly: false,
  developersOnly: false,
  args: false,
  modCommand: false,
  category: 'Vanced',
  async execute(message, args) {
    const pages = [];
    pages.push(
      functions.newEmbed()
        .setTitle('Information about Vanced')
        .setDescription(`Review the table of contents below and jump to the page you need via reactions or by typing \`${functions.prefix}info [page number].\``)
        .addField('Table of Contents', ":one: - `Index`\n:two: - `What in the world is an.apks file?`\n:three: - `What's the latest Vanced version?`\n:four: - `Why I can't download videos?`\n:five: - `Will I get banned for using Vanced?`\n:six: - `Casting to TV`\n:seven: - `When will new update release??!`\n\n:arrow_down: - Page Indicator")
        .setFooter('1/6')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Why do we use new .apks format?')
        .setDescription('~~What if, you wanted to go to heaven, but [vanced.app](https://vanced.app) said: `YoU NeeD SaI To InsTAll VaNcED`~~' +
          '\nJokes aside, Youtube nos uses `.apks` (Split apk). In order to install Vanced, you\'ll need to use SAI (Split Apks Installer).' +
          '\n[Download SAI from Google Play](https://play.google.com/store/apps/details?id=com.aefyr.sai)')
        .setFooter('2/6')
    );
    pages.push(
      functions.newEmbed()
        .addField('Youtube Vanced', '15.05.54')
        .addField('Vanced Microg', '0.2.6.17455-dirty')
        .setTitle('Latest Versions')
        .setDescription(`These are the latest versions. Please make sure you have these. For download links, type ${functions.prefix}download.`)
        .setFooter('3/6')
    );
    pages.push(
      functions.newEmbed()
        .setThumbnail('https://i.imgur.com/NYmMUq5.png')
        .setTitle('Downloading Videos')
        .setDescription('Downloading videos has never been and will never be a feature of Vanced. It led to the closing of many Youtube Mods in the past.\n' +
          '[In some regions](https://support.google.com/youtube/answer/6141269?co=GENIE.Platform%3DAndroid&hl=en) however, downloading is free.\n\n' +
          'For downloading, use a third party tool like [Ymusic](https://ymusic.io).')
        .setFooter('4/6')
    );
    pages.push(
      functions.newEmbed()
        .setImage('https://i.imgur.com/IIJcQ4Z.png')
        .setThumbnail('https://i.imgur.com/6xeelhB.png')
        .setTitle("No, you won't get banned for using Vanced.")
        .setDescription('No, Youtube\'s new ToS do not state that your account might be removed due to not being commercially available. In other words, Youtube will not ban you for using Adblock or Vanced.\n\n' +
          'However, you  use Vanced at your own discretion. Seeing as it is an unofficial client and as we can\'t predict what Youtube will do in the future, there\'s always a very slight risk, and we can\'t guarantee your account\'s safety.')
        .setFooter('5/6')
    );
    pages.push(
      functions.newEmbed()
        .setThumbnail('https://i.imgur.com/gvNSmzo.png')
        .setTitle('Casting to TV')
        .setDescription('Casting to TV doesn\'t actually cast, it just makes your TV open its Youtube app and play the video there.\n' +
          'This means that casting to TV will use the standard Youtube player which has ads and lacks the Vanced modifications.\n' +
          'There\'s nothing Vanced can do about this and this is **not a bug**.')
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
      msg.reactions.removeAll();
    });
  }
};

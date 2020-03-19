const functions = require('../../utils/functions.js');
const config = require('config');
module.exports = {
  name: 'troubleshoot',
  description: 'Get help for most problems here',
  usage: `to view index or jump directly to specific page via ${config.prefix}troubleshoot [page number from 1 to 10] `,
  aliases: ['support', 'ts'],
  guildonly: false,
  developersOnly: false,
  args: false,
  modCommand: false,
  category: 'Vanced',
  async execute(message, args) {
    const pages = [];
    pages.push(
      functions.newEmbed()
        .setTitle('Troubleshooting')
        .setDescription(`Review the table of contents below and jump to the page you need via reactions or by typing \`${functions.prefix}troubleshoot [page number].\``)
        .addField('Table of Contents', ":one: - `Index`\n:two: - `Notice for MiUI users`\n:three: - `About App Compatibility`\n:four: - `Enable dark splash screen`\n:five: - `How to disable 60fps playback`\n:six: - `Notification issues`\n:seven: - `Vanced broken after password change`\n:eight: - `Vanced doesn't want to load`\n:nine: - `Why do I get ads on Home page?`\n:keycap_ten: - `Picture-In-Picture doesn't work`\n:asterisk: - `Your issue isn't listed here?`\n\n:arrow_down: - Page Indicator"
        )
        .setFooter('1/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Notice for MiUI users!')
        .setDescription('Due to some MiUI limitations, you may get errors while installing Vanced using SAI, in order to solve this problem, you have to:\n :one: Enable Developer Options\n :two: Scroll down until you see `Turn on MiUI optimization` and disable it\n :three: Use SAI to install Vanced')
        .setFooter('2/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('App Compatibility issue')
        .setDescription('Some old devices still use old arm architecture, because of that you will get an error in SAI if you\'re using a default version for arm devices.\nIf you get an error that says: `This app is incompatible with your device`, download a `legacy` version from [vanced.app](https://vanced.app) and try again.')
        .setFooter('3/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('How to enable dark splashscreen?')
        .setDescription("To get a dark loading screen, enable dark theme in your system settings. If you don't have this setting, find an app that does it for you on the Google Play Store")
        .setFooter('4/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Disable 60fps playback')
        .setDescription(
          'You can disable 60fps playback in 3 simple steps\n:one: Head over to the vanced settings and tap `about` 7 times to enable the hidden menu\n:two: Go to codec settings\n:three: Set `Override Model` to `sm-t520` and `Override Manufacturer` to `Samsung`'
        )
        .setFooter('5/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle("What to do if I don't get any notifications?")
        .setDescription(`Sometimes you may not get notifications from your favorite YouTubers.\nin order to solve this, you need to adjust some settings.\n:one: Go to Vanced Settings\n:two: tap on Microg settings\n:three: go to \`Google Cloud Messaging > YouTube Vanced\` and set \`ping\` to 60 seconds. \nIf you still don't get any notifications, disable battery optimisation for both Microg and Vanced (see \`${functions.prefix}troubleshoot 8\` for detailed guide)`)
        .setFooter('6/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle("I changed the password of my Google account, now I can't use Vanced.")
        .setDescription('go to `Device Settings > Account`, select the account with the <:oldgacc:679434987560370188> logo and remove it. Then simply add it back via Vanced.')
        .setFooter('7/10')
    );
    pages.push(
      functions.newEmbed()
        .addFields([
          {
            name: 'Stock Android (or close to it)',
            value: 'Open your settings app and navigate to ```Apps & Notifications > See all apps > Vanced Microg > Battery > Battery Optimisation > Dropdown menu > All apps```locate Vanced MicroG and set it to "Don\'t optimise", then reboot.\nIf the issue still persists, do the same for Youtube Vanced.'
          },
          {
            name: "If the above doesn't work for you",
            value: 'Due to the many different Android Roms, this varies. [Visit this site](https://dontkillmyapp.com/), navigate to your vendor and follow the guide.'
          }
        ])
        .setTitle('Smartphones are turning back into dumbphones')
        .setDescription('To squeeze a little extra battery out of your phone, Vendors implement aggresive Battery savers that kill tasks.\n' +
          'MicroG was killed by your battery saver. That\'s why Vanced is stuck. To solve this issue, follow the guide below.')
        .setFooter('8/10')
    );
    pages.push(
      functions.newEmbed()
        .addField('Lucky Patcher', 'In case you are rooted, you can simply use Lucky Patcher to remove the ads.\nJust patch Vanced and select "Remove Google ads".')
        .addField('VPN', 'This is very inconvenient and a bit extreme for only home ads, but a working solution.\n' +
          'Setting your location to any location that doesn\'t have home ads (such as Finland) will solve the problem.')
        .setThumbnail('https://i.imgur.com/TXiSaeI.png')
        .setTitle('Home Ads')
        .setDescription('You might be getting ads on your home feed.\nNo, these aren\'t placed there by the Vanced Devs to make a quick buck.\n' +
          'Youtube somehow detects that Vanced blocks ads and thus gives you extra ads which are based on your region.\nSadly, the devs have yet to find a fix for this. However there are some ways for you to solve them.')
        .setFooter('9/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle('Picture-in-Picture is not working')
        .setDescription("The way PiP works is controlled by your operating system. If it's broken, there's nothing we can do, so please don't report PiP related issues.")
        .setFooter('10/10')
    );
    pages.push(
      functions.newEmbed()
        .setTitle("My issue isn't listed here")
        .setDescription('If you couldn\'t find your problem here, simply ask for help in <#358967876193091584>\nOnce the issue is solved, a solution for this very problem will be added here.')
        .setFooter('*')
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

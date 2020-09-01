import { Command, Message } from '../../Client';
import { config } from '../../config/index';
import { stripIndents } from 'common-tags';
import { MessageEmbed } from 'discord.js';

const embed = () => new MessageEmbed().setTimestamp().setColor('0D7DFF');
const pages = [
	embed()
		.setTitle('MiUi')
		.setDescription(
			stripIndents`
			You might run into issues while using Vanced, as MiUi is known to cause trouble. To solve this, disable MiUi optimisation:
			 :one: Enable Developer options (\`Settings > About Phone (or something similar) > Tap Build Number 7 times\`) and enter the developer settings menu
			 :two: Scroll down until you see \`Turn on MiUI optimization\`
			 :three: Disable it`
		),

	embed()
		.setTitle('Old devices')
		.setDescription(
			stripIndents`
				If you have an old device, it might be using the arm (32bit) kernel architecture instead of arm64 (64bit)
				If you get the error \`This app is incompatible with your device\`, this is the case.
				Download the legacy version instead and try again.`
		),

	embed()
		.setTitle('Dark Splashscreen')
		.setDescription(
			"To get a dark loading screen, enable dark theme in your system settings. If you don't have this setting, find an app that does it for you on the Google Play Store"
		),

	embed()
		.setTitle('Disable 60fps playback')
		.setDescription(
			stripIndents`
			You can disable 60fps playback in 3 simple steps
			:one: Head over to the vanced settings and tap \`about\` 7 times to enable the hidden menu
			:two: Go to codec settings
			:three: Set \`Override Model\` to \`sm - t520\` and \`Override Manufacturer\` to \`Samsung\``
		),

	embed()
		.setTitle('Notifications')
		.setDescription(
			stripIndents`
				Sometimes you may not get notifications from your favourite YouTubers.
				To solve this issue:
				:one: Go to Vanced Settings
				:two: tap on MicroG settings
				:three: go to \`Google Cloud Messaging > YouTube Vanced\` and set \`ping\` to 60 seconds, then set it back.
				If you still don't get any notifications, disable battery optimisation for both MicroG and Vanced (see \`${config.defaultPrefix}troubleshoot 8\` for a detailed guide)`
		),

	embed()
		.setTitle('Vanced broken after password change')
		.setDescription(
			'Go to `Device Settings > Account`, select the account with the <:oldgacc:679434987560370188> logo and remove it. Then simply add it back via Vanced.'
		),

	embed()
		.addFields([
			{
				name: 'Stock Android (or close to it)',
				value: stripIndents`
					Open your settings app and navigate to
					${'Apps & Notifications > See all apps > Vanced Microg > Battery > Battery Optimisation > Dropdown menu > All apps'.toCodeblock('css')}
					Locate Vanced MicroG and set it to \`Don't optimise\`, then reboot.
					If the issue still persists, do the same for Youtube Vanced.`
			},
			{
				name: "If the above doesn't work for you",
				value:
					'Due to the many different Android Roms, this varies. [Visit this site](https://dontkillmyapp.com/), navigate to your vendor and follow the guide.'
			}
		])
		.setTitle('Smartphones are turning back into dumbphones')
		.setDescription(
			'To squeeze a little extra battery out of your phone, Vendors implement aggresive Battery savers that kill tasks.\n' +
				"MicroG was killed by your battery saver. That's why Vanced is stuck. To solve this issue, follow the guide below."
		),

	embed()
		.setThumbnail('https://i.imgur.com/TXiSaeI.png')
		.setTitle('Home Ads')
		.setDescription(
			stripIndents`
				You might be getting ads on your home feed.
				No, these aren't placed there by the Vanced Devs to make a quick buck. Youtube somehow detects that Vanced blocks ads and thus gives you extra ads which are based on your region.
				This will be fixed in the next release!

				|| Tip: To get this update early, become a tester or boost the server ||`
		),

	embed()
		.setTitle('Picture-in-Picture not working')
		.setDescription(
			"The way PiP works is controlled by your operating system. If it's broken, there's nothing we can do, so please don't report PiP related issues."
		)
];

const callback = async (msg: Message, args: string[]) => {
	let initPage = (args.length ? parseInt(args[0], 10) - 1 : 0) || 0;
	if (initPage > pages.length) initPage = 0;
	return msg.client.pages.create(msg, pages, initPage);
};

export const command: Command = {
	aliases: ['troubleshoot', 'ts'],
	description: 'Troubleshoot Vanced issues. For your own issues, consult your therapist ;)',
	usage: '[Page]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

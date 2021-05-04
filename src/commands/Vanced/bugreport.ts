import { MessageEmbed } from 'discord.js';
import { Message } from '../../Client/Interfaces/Message';
import { Command } from '../../Client/Interfaces/Command';
import { stripIndents } from 'common-tags';

const embed = () => new MessageEmbed().setTimestamp().setColor('0D7DFF');
const pages = [
	embed()
		.setTitle('Report a regular bug')
		.setDescription(
			stripIndents`
			Modifying an app is not an easy job, sometimes applying a modification can cause an unexpected bug and we can't catch all of them. 
			That's where you come in!  If you experience a bug and want to help us improve Vanced, you would help a ton by providing a logcat.
			A logcat is a log of all processes on your system. This helps a lot with identifying the problem. This is however a bit inconvenient and requires a pc.
			If you do have one, please take the time and take one to help us fix this!`
		)
		.addFields([
			{
				name: 'On your Phone',
				value:
					':one: Open your settings app and go to `About Phone/Phone Info` and click your build number 7 times.\n:two: Now go back to the settings main menu.\n:three: You will now either have a new tab `Developer Options` in this menu or in the system menu.\n:four: Open Developer Options and enable `USB-Debugging`.'
			},
			{
				name: 'On your PC/Laptop',
				value: stripIndents`
						:one: [Visit this website](https://developer.android.com/studio/releases/platform-tools) and download the tools for your operating system.
						:two: Extract them.
						:three: Open the extracted folder to find many \`.exe\` files.
						:four: \`Shift + Rightclick\` the background of the extracted folder and select \`Run command prompt / powershell here\`.
						:five: Plug your phone into your PC, unlock it and grant USB-Debugging Permission.
						:six: Type \`adb devices\`. If your phone is shown, proceed. If not, google for \`[yourBrandHere] usb drivers\` and install them.
						:seven: Type \`adb logcat -c\`, then \`adb logcat *:W > logcat.txt\`.
						:eight: Open your Vanced, reproduce your bug and then close the command prompt.
						:nine: Now you will find a new file \`logcat.txt\` in the folder. Open it, scan it quickly to remove confidential info.
						Press \`CTRL + A\` => \`CTRL + C\`, open https://hastebin.com/, paste it and save. Use the output link for your bug report.`
			}
		]),
	embed()
		.setTitle('Report Theme bugs')
		.addFields([
			{
				name: 'Before you continue',
				value:
					"Please read info in <#663348498389008384> to completely understand how to report a bug, otherwise your report won't be viewed. Don't forget to check <#663158441879142410> to see if your bug has already been reported"
			},
			{
				name: "Let's get started",
				value: stripIndents`
					After you have downloaded \`Developer Assistant\`, open Vanced and find the bug, then open layoutviewer by holding down your home button until the app launches.
					Now follow these steps:
					:one: Make sure the bug you're experiencing is on the screen
					:two: Tap on the element that you think is affected by a bug
					:three: Go to the \`Element\` and \`Hierarchy\` tabs and screenshot the output
					:four: Now head over to <#663170881572438036> and report the bug`
			},
			{
				name: 'When will my bug be reviewed?',
				value: 'Your feedback will be reviewed as soon as possible. This should ususally not take lonegr than 6 hours. Thanks for understanding!'
			}
		])
		.setDescription(
			'This guide will show you how to report Theme based bugs.\nIn order to report bugs, you will need [Developer Assistant](https://play.google.com/store/apps/details?id=com.appsisle.developerassistant)'
		)
];

const callback = async (msg: Message, args: string[]) => {
	let initPage = (args.length ? parseInt(args[0], 10) - 1 : 0) || 0;
	if (initPage > pages.length) initPage = 0;
	return msg.client.pages.create(msg, pages, initPage);
};

export const command: Command = {
	aliases: ['bugs', 'bug'],
	description: 'Report Vanced bugs. For broken toasters and such, consult your local Indian tech guru ;P',
	usage: '[Page]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

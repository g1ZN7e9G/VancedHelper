import { Command, Message } from '../../Client';
import { MessageEmbed } from 'discord.js';
import { stripIndents } from 'common-tags';

const callback = async (msg: Message, args: string[]) => {
	let initPage = (args.length ? parseInt(args[0]) - 1 : 0) || 0;
	if (initPage > pages.length) initPage = 0;
	msg.client.pages.create(msg, pages, initPage);
};

export const command: Command = {
	aliases: ['install'],
	description: 'A Vanced install guide',
	usage: '[Page]',
	devOnly: false,
	guildOnly: false,
	args: 0,
	memberPermission: [],
	botPermission: [],
	callback: callback
};

const embed = () => new MessageEmbed().setTimestamp().setColor('0D7DFF');
const pages = [
	embed()
		.setTitle('Get started')
		.addFields([
			{
				name: 'Which variant should I pick?',
				value: stripIndents`
						:one: First thing you'll see is an option to select either non-root or root variants. If you don't know what this means, simply select non-root.
						:two: Now you'll have to select either variant: default or legacy. 
						Default is for newer devices with arm64 (64bit) cpus. 
						Legacy variant is for older devices with arm (32bit) cpus.
						Simply go with the default version and if it doesn't work, try the legacy one.
						:three: Finally you'll have to select a theme: dark or black. 
						Dark variant has default dark.
						Black variant is full black.
						Contrary to popular belief, the latter does not save more energy on amoled screens, so select whichever you prefer.
						
						__IMPORTANT__
						To be able to use Vanced on nonroot devices, you'll need to download and install MicroG from the same website.
						
						Now follow the instructions on next pages`
			},
			{
				name: 'Note:',
				value: 'If downloaded files have the `.bin` extension, simply rename them to `.apks` (**not** .apk) and continue to the next page'
			}
		]),
	embed()
		.setTitle('Non-Root Guide')
		.addField(
			'For non-root users:',
			stripIndents`
				Before continuing, make sure you have followed the instructions on the previous page and downloaded a Vanced \`.apks\` file
				:one: Download the app \`SAI\` from the Google Play Store
				:two: Open it and press \`Install APKS\`
				:three: Navigate to folder you saved the vanced file to.
				:four: Select it and install. Wait patiently as this might take a bit, especially on older Android version.`
		),
	embed()
		.setTitle('Root Guide - Disabling Signature Verification')
		.setDescription(
			'To be able to Install Vanced on rooted devices, you will have to disable Signature Verification first.\nThis guide will show you 2 methods of disabling it!'
		)
		.addFields([
			{
				name: 'Using *Yellow Man* (Lucky Patcher)',
				value: stripIndents`
					:one: Open Lucky Patcher
					:two: Open the \`toolbox\`
					:three: Choose \`Patch to Android\`
					:four: Select \`Disable.apk signature verification\`
					:five: Press \`Apply\`
					Note: Your device may suddenly reboot, this is completely normal. If it does not reboot on it's own, reboot manually.`
			},
			{
				name: 'Using an Xposed module',
				value: stripIndents`
					We do not recommend Xposed, so only use this method if the above method doesn't work and undo it once you installed Vanced.
					This method requires you to have rooted your phone using Magisk.
					You will first install EdXposed (A systemless approach to Xposed). If you already have Xposed installed, skip this step
					:one: Open your Magisk Manager and go to the Downloads Tab
					:two: Search for \`Riru\`
					:three: Install the \`Riru (Riru - Core)\` module and the \`Riru EdXposed\` module
					:four: Download and install the latest [EdXposed Manager apk](https://github.com/ElderDrivers/EdXposedManager/releases)
					:five: Reboot
					Now that you have EdXposed installed, open the app and navigate to the Download section. Download and install the DSV module, then activate it.
					Reboot once again`
			},
			{
				name: 'WARNING',
				value: "After you're done installing Vanced, we highly recommend you re-enable signature verification as having it disabled is a security risk"
			}
		]),
	embed()
		.setTitle('Root Guide - Installing Vanced')
		.addField(
			'Installation',
			stripIndents`
			For this method, you will need have your Signature Verification disabled (See previous page)
			:one: Download SAI from Google Play Store and open it
			:two: Navigate to the settings menu
			:three: Scroll down and under 'Installation Method' select "rooted mode"
			:four: Go to main menu and select "Install apks"
			:five: Navigate to the folder where you have your Vanced file saved and install it.`
		),
	embed()
		.setTitle('Alternative Installation Method')
		.addField(
			'You can install Vanced using ADB too',
			stripIndents`
			This method requires a PC. It works for both non-root and root, though for the latter you will have to have your signature verification disabled.
			You will need the [Android SDK Platform Tools](https://developer.android.com/studio/releases/platform-tools) for this method.
			:one: Download Vanced and extract it (it's just a zip)
			:two: Delete all language files and only keep the english and additionally any languages you will be using. Option: Rename the files to short and easy to type names, as you will have to enter them in a terminal.
			:three: Connect your phone to your pc and open a terminal in the folder containing the Vanced apks (\`Ctrl + Shift + Right Click\` the folder background > Open Powershell/command prompt here)
			:four: Run the following command adjusting the file names
			${'adb install-multiple apk1.apk apk2.apk...'.toCodeblock('bash')}`
		)
];

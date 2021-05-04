import { Command, Message } from '../../Client';
import tinycolour from 'tinycolor2';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	const settings = await msg.client.database.guildSettings.findOne({ guild: msg.guild.id });
	if (!settings || !settings.boosterRole || !settings.modRole) throw new Error('Please set the booster and modrole.');

	if (
		!msg.member.roles.cache.has(settings.boosterRole) &&
		!msg.member.roles.cache.has(settings.modRole) &&
		!msg.client.config.developers.includes(msg.author.id)
	)
		return msg.channel.send(`You're not a booster bro ${msg.client.bruh}`);

	const [colourRaw, ...roleRaw] = args;

	let colour: string | tinycolour.Instance = colourRaw ? tinycolour(colourRaw) : tinycolour.random();
	if (!colour.isValid()) return msg.channel.send(`That's not a valid colour. Please try again!`);

	colour = colour.toHex() === '000000' ? '#000001' : colour.toHexString();

	const roleName = `${roleRaw.join(' ') || colour}-CC`;
	if (roleName.length > 100) return msg.channel.send('That name is waaaaay too long!');

	const existingRole = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

	const dbEntry =
		(await msg.client.database.colourRoles.findOne({ userID: msg.author.id })) ??
		(await msg.client.database.colourRoles.create({ userID: msg.author.id, roleID: '', roleColour: '', roleName: '' }));

	if (existingRole && existingRole.id !== dbEntry.roleID) return msg.channel.send(`Sorry, but that role name is already taken. Please use another one!`);
	if (dbEntry.roleID) {
		const role = msg.guild.roles.cache.get(dbEntry.roleID);
		if (role) {
			void role.edit({ name: roleName, color: colour });
			return msg.channel.send('Successfully updated your colour role!');
		}
	}

	const role = await msg.guild.roles.create({
		data: {
			name: roleName,
			color: colour,
			position: msg.member.roles.highest.position + 1
		}
	});

	dbEntry.roleID = role.id;
	dbEntry.roleColour = role.hexColor;
	dbEntry.roleName = role.name;
	void dbEntry.save();

	void msg.member.roles.add(role);

	return msg.channel.send(`Successfully created your role ${role.name} with the colour ${role.hexColor}!`);
};

export const command: Command = {
	aliases: ['colorme', 'colour', 'color', 'setcolour', 'setcolor', 'setrole', 'roleme'],
	description: 'Booster only command to get a custom role',
	usage: '[Colour] [Role Name]',
	devOnly: false,
	guildOnly: true,
	args: 0,
	memberPermission: [],
	botPermission: ['MANAGE_ROLES'],
	callback: callback
};

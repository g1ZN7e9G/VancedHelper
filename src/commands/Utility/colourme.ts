import { Command, Message } from '../../Client';
import tinycolour from 'tinycolor2';

const callback = async (msg: Message, args: string[]) => {
	if (!msg.client.helpers.isGuild(msg)) return;

	if (!msg.member.roles.cache.some(r => r.name === 'Nitro Booster') && !msg.client.config.developers.includes(msg.author.id))
		return msg.channel.send(`You're not a booster bro ${msg.client.bruh}`);

	const [colourRaw, ...roleRaw] = args;

	let colour: string | tinycolour.Instance = colourRaw ? tinycolour(colourRaw) : tinycolour.random();
	if (!colour.isValid()) return msg.channel.send(`That's not a valid colour. Please try again!`);
	else colour = colour.toHex() === '000000' ? '#000001' : colour.toHexString();

	const roleName = (roleRaw.join(' ') || colour) + '-CC';

	const existingRole = msg.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());

	const dbEntry =
		(await msg.client.database.colourRoles.findOne({ userID: msg.author.id })) ||
		(await msg.client.database.colourRoles.create({ userID: msg.author.id, roleID: '', roleColour: '', roleName: '' }));

	if (existingRole && existingRole.id !== dbEntry.roleID) return msg.channel.send(`Sorry, but that role name is already taken. Please use another one!`);
	if (dbEntry.roleID) {
		const role = msg.guild.roles.cache.get(dbEntry.roleID);
		if (role) {
			role.edit({ name: roleName, color: colour });
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
	dbEntry.save();

	msg.member.roles.add(role);

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

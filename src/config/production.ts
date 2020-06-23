import { Config } from '.';

const config: Config = {
	token: process.env.BOT_TOKEN!,
	mongoString: process.env.MONGO_STRING!,
	coinlibToken: process.env.COINLIB_TOKEN!,
	defaultPrefix: '-',
	developers: ['265560538937819137', '256143257472335872', '202115709231300617'],
	channels: {
		info: '658781799580827648',
		errors: '663451700329185320',
		boosters: '655495772405497895',
		testers: '358967484243640321'
	}
};

module.exports = config;

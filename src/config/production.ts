import { Config } from '.';

const config: Config = {
	token: process.env.BOT_TOKEN!,
	mongoString: process.env.MONGO_STRING!,
	defaultPrefix: '-',
	developers: ['265560538937819137'],
	channels: {
		info: '',
		errors: ''
	}
};

module.exports = config;

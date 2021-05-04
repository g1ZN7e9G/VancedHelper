/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const config: Config = require(`./${process.env.NODE_ENV!}`);

export interface Config {
	token: string;
	coinlibToken: string;
	youtubeToken: string;
	mongoString: string;
	defaultPrefix: string;
	developers: string[];
	channels: {
		info: string;
		errors: string;
		boosters: string;
		testers: string;
	};
}

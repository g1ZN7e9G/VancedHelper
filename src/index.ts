import { Client } from './Client';

// Load extensions
import './struct/Array';
import './struct/String';
import './struct/Date';
import './struct/Number';

const client = new Client({
	baseOptions: {
		disableMentions: 'everyone',
		presence: {
			activity: {
				name: `@Vanced Helper#0634`,
				type: 'LISTENING',
				url: 'https://www.twitch.tv/.'
			}
		},
		partials: ['MESSAGE', 'REACTION']
	}
});

client.start();

process.on('uncaughtException', client.handleError);
process.on('unhandledRejection', err => {
	if (!err) err = new Error('An Unhandled Promise Rejection occurred but it had no error!');
	if ((err as Error).stack && (err as Error).name) client.handleError(err as Error);
	else console.error(err);
});

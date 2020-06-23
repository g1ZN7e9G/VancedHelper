import { Client, Message, FullCommand } from '../Client';

export default async (client: Client, msg: Message, _command: FullCommand, err: any) => {
	client.handleError(err, msg);
	msg.client.activeCommands.delete(msg.author.id);
};

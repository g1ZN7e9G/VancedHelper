import { Client, Message, FullCommand } from '../Client';

export default (client: Client, msg: Message, _command: FullCommand, err: any) => {
	void client.handleError(err, msg);
	msg.client.activeCommands.delete(msg.author.id);
};

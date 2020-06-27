import { Document, Schema, model } from 'mongoose';

export interface ReactionRoles extends Document {
	channelID: string;
	messageID: string;
	reactionRoles: {
		emojiID: string;
		roleID: string;
	}[];
}

const ReactionRoleSchema = new Schema({
	channelID: String,
	messageID: String,
	reactionRoles: [
		{
			emojiID: String,
			roleID: String
		}
	]
});

export default model<ReactionRoles>('ReactionRoles', ReactionRoleSchema);

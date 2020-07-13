import { Document, Schema, model } from 'mongoose';

export interface GuildSettings extends Document {
	guild: string;
	musicChannel: string;
}

const GuildSettingsSchema = new Schema({
	guild: String,
	musicChannel: String
});

export default model<GuildSettings>('GuildSettings', GuildSettingsSchema);

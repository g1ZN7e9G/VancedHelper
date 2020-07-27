import { Document, Schema, model } from 'mongoose';

export interface GuildSettings extends Document {
	guild: string;
	musicChannel?: string;
	modLogChannel?: string;
	boosterRole?: string;
	muteRole?: string;
	modRole?: string;
}

const GuildSettingsSchema = new Schema<GuildSettings>({
	guild: String,
	musicChannel: String,
	modLogChannel: String,
	boosterRole: String,
	muteRole: String,
	modRole: String
});

export default model<GuildSettings>('GuildSettings', GuildSettingsSchema);

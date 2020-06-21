import { Document, Schema, model } from 'mongoose';

export interface ColourRoles extends Document {
	userID: string;
	roleID: string;
	roleName: string;
	roleColour: string;
}

const ColourRoleSchema = new Schema({
	userID: String,
	roleID: String,
	roleName: String,
	roleColour: String
});

export default model<ColourRoles>('ColourRoles', ColourRoleSchema);

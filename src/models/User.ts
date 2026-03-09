import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  name: string;
  email: string;
  role: 'VASP' | 'REGULATOR';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  role: { type: String, enum: ['VASP', 'REGULATOR'], required: true }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IVASP extends Document {
  vaspId: string;
  topicId: string;
}

const VASPSchema: Schema = new Schema({
  vaspId: { type: String, required: true, unique: true },
  topicId: { type: String, required: true }
});

export default mongoose.models.VASP || mongoose.model<IVASP>('VASP', VASPSchema);

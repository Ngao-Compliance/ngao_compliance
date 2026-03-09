import mongoose, { Schema, Document } from 'mongoose';

export interface ISAR extends Document {
  transactionId: mongoose.Types.ObjectId;
  vaspId: string;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED';
  regulatorNotes: string;
  narrative: string;
  reporterName: string;
  submissionDate: Date | null;
}

const SARSchema: Schema = new Schema({
  transactionId: { type: Schema.Types.ObjectId, ref: 'Transaction', required: true },
  vaspId: { type: String, required: true },
  status: { type: String, enum: ['DRAFT', 'SUBMITTED', 'REVIEWED'], default: 'DRAFT' },
  regulatorNotes: { type: String, default: '' },
  narrative: { type: String, required: true },
  reporterName: { type: String, required: true },
  submissionDate: { type: Date, default: null }
});

export default mongoose.models.SAR || mongoose.model<ISAR>('SAR', SARSchema);

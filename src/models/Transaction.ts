import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  txHash: string;
  senderAddress: string;
  receiverAddress: string;
  amount: number;
  asset: string;
  timestamp: Date;
  vaspId: string;
  riskScore: number;
  flags: string[];
  status: 'PENDING' | 'CLEARED' | 'FLAGGED';
}

const TransactionSchema: Schema = new Schema({
  txHash: { type: String, required: true, unique: true },
  senderAddress: { type: String, required: true },
  receiverAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  asset: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  vaspId: { type: String, required: true },
  riskScore: { type: Number, required: true },
  flags: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'CLEARED', 'FLAGGED'], default: 'PENDING' }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);

import mongoose, { Types, Document } from "mongoose";

export interface IServiceAgreement extends Document {
  jobId: Types.ObjectId;
  clientId: Types.ObjectId;
  providerId: Types.ObjectId;
  conversationId: Types.ObjectId;
  agreedBudget: number;
  agreedTime: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const serviceAgreementSchema = new mongoose.Schema<IServiceAgreement>({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
  agreedBudget: { type: Number, required: true },
  agreedTime: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' }
}, { timestamps: true });

export default mongoose.model<IServiceAgreement>("ServiceAgreement", serviceAgreementSchema);

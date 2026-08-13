import mongoose, { Types, Document } from "mongoose";

export interface IChatConversation extends Document {
  _id: Types.ObjectId;
  jobId: Types.ObjectId;
  clientId: Types.ObjectId; // The user who posted the job
  providerId: Types.ObjectId; // The provider (User model reference)
  lastMessage?: string;
  lastMessageAt?: Date;
  proposedBudget?: number;
  proposedTime?: string;
  clientConfirmed?: boolean;
  providerConfirmed?: boolean;
  agreementId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatConversationSchema = new mongoose.Schema<IChatConversation>({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lastMessage: { type: String },
  lastMessageAt: { type: Date },
  proposedBudget: { type: Number },
  proposedTime: { type: String },
  clientConfirmed: { type: Boolean, default: false },
  providerConfirmed: { type: Boolean, default: false },
  agreementId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceAgreement' }
}, { timestamps: true });

// Ensure unique conversation per job per provider-client pair
chatConversationSchema.index({ jobId: 1, clientId: 1, providerId: 1 }, { unique: true });

export default mongoose.model("ChatConversation", chatConversationSchema);

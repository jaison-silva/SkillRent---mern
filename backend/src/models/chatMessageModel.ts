import mongoose, { Types, Document } from "mongoose";

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId; // The user who sent the message
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatMessageSchema = new mongoose.Schema<IChatMessage>({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatConversation', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

// Index on conversationId for quick retrieval of message history
chatMessageSchema.index({ conversationId: 1, createdAt: 1 });

export default mongoose.model("ChatMessage", chatMessageSchema);

import { IChatConversation } from "../../models/chatConversationModel";
import { IChatMessage } from "../../models/chatMessageModel";

export interface IChatService {
  getOrCreateConversation(jobId: string, clientId: string, providerId: string): Promise<IChatConversation>;
  getUserConversations(userId: string): Promise<IChatConversation[]>;
  getConversationMessages(conversationId: string): Promise<IChatMessage[]>;
  saveMessage(conversationId: string, senderId: string, content: string): Promise<IChatMessage>;
  proposeTerms(conversationId: string, userId: string, budget: number, time: string): Promise<IChatConversation>;
  toggleConfirmation(conversationId: string, userId: string): Promise<{ conversation: IChatConversation, agreement?: any }>;
}

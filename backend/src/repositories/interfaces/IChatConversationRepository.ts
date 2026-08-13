import { IChatConversation } from "../../models/chatConversationModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatConversationRepository extends IBaseRepository<IChatConversation> {
  findByParticipantsAndJob(jobId: string, clientId: string, providerId: string): Promise<IChatConversation | null>;
  getUserConversations(userId: string): Promise<IChatConversation[]>;
}

import { IChatMessage } from "../../models/chatMessageModel";
import { IBaseRepository } from "./IBaseRepository";

export interface IChatMessageRepository extends IBaseRepository<IChatMessage> {
  getMessagesByConversationId(conversationId: string): Promise<IChatMessage[]>;
}

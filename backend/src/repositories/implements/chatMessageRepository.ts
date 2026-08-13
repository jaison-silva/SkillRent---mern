import ChatMessage, { IChatMessage } from "../../models/chatMessageModel";
import { IChatMessageRepository } from "../interfaces/IChatMessageRepository";
import { BaseRepository } from "./baseRepository";

export class MongoChatMessageRepository extends BaseRepository<IChatMessage> implements IChatMessageRepository {
  constructor() {
    super(ChatMessage);
  }

  async getMessagesByConversationId(conversationId: string): Promise<IChatMessage[]> {
    return this.model.find({ conversationId })
      .populate('senderId', 'name profilePicture')
      .sort({ createdAt: 1 });
  }
}

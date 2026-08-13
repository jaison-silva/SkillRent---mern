import ChatConversation, { IChatConversation } from "../../models/chatConversationModel";
import { IChatConversationRepository } from "../interfaces/IChatConversationRepository";
import { BaseRepository } from "./baseRepository";

export class MongoChatConversationRepository extends BaseRepository<IChatConversation> implements IChatConversationRepository {
  constructor() {
    super(ChatConversation);
  }

  async findByParticipantsAndJob(jobId: string, clientId: string, providerId: string): Promise<IChatConversation | null> {
    return this.model.findOne({ jobId, clientId, providerId });
  }

  async getUserConversations(userId: string): Promise<IChatConversation[]> {
    // A user can be either a client or a provider in a conversation
    return this.model.find({
      $or: [{ clientId: userId }, { providerId: userId }]
    })
    .populate('jobId', 'title budget time status')
    .populate('clientId', 'name profilePicture')
    .populate('providerId', 'name profilePicture')
    .sort({ updatedAt: -1 });
  }
}

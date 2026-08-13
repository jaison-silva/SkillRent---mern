import { IChatService } from "../interfaces/IChatService";
import { IChatConversationRepository } from "../../repositories/interfaces/IChatConversationRepository";
import { IChatMessageRepository } from "../../repositories/interfaces/IChatMessageRepository";
import { IChatConversation } from "../../models/chatConversationModel";
import { IChatMessage } from "../../models/chatMessageModel";
import ApiError from "../../utils/apiError";
import { StatusCodes } from "http-status-codes";

export class ChatService implements IChatService {
  private _conversationRepo: IChatConversationRepository;
  private _messageRepo: IChatMessageRepository;

  constructor(conversationRepo: IChatConversationRepository, messageRepo: IChatMessageRepository) {
    this._conversationRepo = conversationRepo;
    this._messageRepo = messageRepo;
  }

  async getOrCreateConversation(jobId: string, clientId: string, providerId: string): Promise<IChatConversation> {
    if (!jobId || !clientId || !providerId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required parameters for conversation");
    }

    let conversation = await this._conversationRepo.findByParticipantsAndJob(jobId, clientId, providerId);

    if (!conversation) {
      conversation = await this._conversationRepo.create({
        jobId: jobId as any,
        clientId: clientId as any,
        providerId: providerId as any
      });
    }

    return conversation;
  }

  async getUserConversations(userId: string): Promise<IChatConversation[]> {
    return this._conversationRepo.getUserConversations(userId);
  }

  async getConversationMessages(conversationId: string): Promise<IChatMessage[]> {
    return this._messageRepo.getMessagesByConversationId(conversationId);
  }

  async saveMessage(conversationId: string, senderId: string, content: string): Promise<IChatMessage> {
    const message = await this._messageRepo.create({
      conversationId: conversationId as any,
      senderId: senderId as any,
      content,
      isRead: false
    });

    // Update last message in conversation
    await this._conversationRepo.updateById(conversationId, {
      lastMessage: content,
      lastMessageAt: new Date()
    });

    return message;
  }

  async proposeTerms(conversationId: string, userId: string, budget: number, time: string): Promise<IChatConversation> {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");

    // Reset confirmations when terms are updated
    const updated = await this._conversationRepo.updateById(conversationId, {
      proposedBudget: budget,
      proposedTime: time,
      clientConfirmed: false,
      providerConfirmed: false
    });
    
    if (!updated) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update terms");
    return updated;
  }

  async toggleConfirmation(conversationId: string, userId: string): Promise<{ conversation: IChatConversation, agreement?: any }> {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) throw new ApiError(StatusCodes.NOT_FOUND, "Conversation not found");

    if (conversation.agreementId) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Service agreement already exists");
    }

    const isClient = conversation.clientId.toString() === userId;
    const isProvider = conversation.providerId.toString() === userId;

    if (!isClient && !isProvider) {
      throw new ApiError(StatusCodes.FORBIDDEN, "User is not part of this conversation");
    }

    const updateData: any = {};
    if (isClient) updateData.clientConfirmed = !conversation.clientConfirmed;
    if (isProvider) updateData.providerConfirmed = !conversation.providerConfirmed;

    let updatedConv = await this._conversationRepo.updateById(conversationId, updateData);
    if (!updatedConv) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Failed to update confirmation");

    // Check if both confirmed now
    if (updatedConv.clientConfirmed && updatedConv.providerConfirmed && updatedConv.proposedBudget && updatedConv.proposedTime) {
      // Both confirmed! Create Service Agreement
      const ServiceAgreementModel = (await import('../../models/serviceAgreementModel')).default;
      const JobModel = (await import('../../models/jobModel')).default;

      const agreement = await ServiceAgreementModel.create({
        jobId: updatedConv.jobId,
        clientId: updatedConv.clientId,
        providerId: updatedConv.providerId,
        conversationId: updatedConv._id,
        agreedBudget: updatedConv.proposedBudget,
        agreedTime: updatedConv.proposedTime
      });

      updatedConv = await this._conversationRepo.updateById(conversationId, {
        agreementId: agreement._id as any
      });

      // Update the original Job
      await JobModel.findByIdAndUpdate(updatedConv!.jobId, {
        budget: updatedConv!.proposedBudget,
        time: updatedConv!.proposedTime,
        status: 'in-progress'
      });

      return { conversation: updatedConv!, agreement };
    }

    return { conversation: updatedConv };
  }
}

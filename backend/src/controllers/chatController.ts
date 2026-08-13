import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { IChatService } from "../services/interfaces/IChatService";
import { StatusCodes } from "http-status-codes";

export class ChatController {
  private _chatService: IChatService;

  constructor(chatService: IChatService) {
    this._chatService = chatService;
  }

  getConversations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const conversations = await this._chatService.getUserConversations(userId);
      ApiResponse.success(res, { conversations }, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const conversationId = req.params.conversationId;
      
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const messages = await this._chatService.getConversationMessages(conversationId);
      ApiResponse.success(res, { messages }, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getOrCreateConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const { jobId, clientId, providerId } = req.body;
      
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const conversation = await this._chatService.getOrCreateConversation(jobId, clientId, providerId);
      
      // If conversation is just created or missing proposed fields, populate from Job
      if (!conversation.proposedBudget || !conversation.proposedTime) {
        const JobModel = (await import('../models/jobModel')).default;
        const job = await JobModel.findById(jobId);
        if (job) {
          conversation.proposedBudget = job.budget;
          conversation.proposedTime = job.time;
          await conversation.save();
        }
      }

      ApiResponse.success(res, { conversation }, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  proposeTerms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const conversationId = req.params.conversationId;
      const { budget, time } = req.body;

      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const conversation = await this._chatService.proposeTerms(conversationId, userId, budget, time);
      
      // Emit socket event to notify other party (we can emit to room here or let client refetch/listen)
      // For simplicity, client can just refetch on socket event "terms_updated"
      const { chatContainer } = await import('../container/container');
      // A cleaner way is emitting from socketManager, but since we are in HTTP, we just return the new state.

      ApiResponse.success(res, { conversation }, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  toggleConfirmation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const conversationId = req.params.conversationId;

      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const result = await this._chatService.toggleConfirmation(conversationId, userId);
      ApiResponse.success(res, result, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}

import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { IJobService } from "../services/interfaces/IJobService";
import { CreateJobRequestDTO } from "../dto/job/jobDTO";
import { StatusCodes } from "http-status-codes";
import { API_RESPONSES } from "../constants/statusMessageConstant";

export class JobController {
  private _jobService: IJobService;

  constructor(jobService: IJobService) {
    this._jobService = jobService;
  }

  createJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const data: CreateJobRequestDTO = req.body;

      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const job = await this._jobService.createJob(userId, data);
      ApiResponse.success(res, { job }, { message: "Job posted successfully" }, StatusCodes.CREATED);
    } catch (error) {
      next(error);
    }
  };

  getAllOpenJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "newest";

      const { jobs, total } = await this._jobService.getAllOpenJobs(page, limit, search, sort);
      ApiResponse.success(res, { jobs }, { total }, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getJobsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "newest";
      const status = (req.query.status as string) || undefined;

      const { jobs, total } = await this._jobService.getJobsByUserId(userId, page, limit, search, sort, status);
      ApiResponse.success(res, { jobs }, { total }, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  getDirectJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }
      // We need to find the provider by userId first to get their Provider ID
      const Provider = (await import("../models/providerModel")).default;
      const provider = await Provider.findOne({ userId });
      if (!provider) {
        ApiResponse.error(res, "Provider profile not found", "NOT_FOUND", StatusCodes.NOT_FOUND);
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "newest";

      const { jobs, total } = await this._jobService.getDirectJobsForProvider(provider._id as string, page, limit, search, sort);
      ApiResponse.success(res, { jobs }, { total }, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  updateJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const jobId = req.params.id;
      const data = req.body;

      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const job = await this._jobService.updateJob(jobId, userId, data);
      ApiResponse.success(res, { job }, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  deleteJob = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      const jobId = req.params.id;

      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      await this._jobService.deleteJob(jobId, userId);
      ApiResponse.success(res, null, null, StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}

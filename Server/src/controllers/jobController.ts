import { Request, Response, NextFunction } from "express";
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
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const job = await this._jobService.createJob(userId, data);
      res.status(StatusCodes.CREATED).json({ message: "Job posted successfully", job });
    } catch (error) {
      next(error);
    }
  };

  getAllOpenJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const jobs = await this._jobService.getAllOpenJobs();
      res.status(StatusCodes.OK).json({ jobs });
    } catch (error) {
      next(error);
    }
  };

  getJobsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const sort = (req.query.sort as string) || "newest";
      const status = (req.query.status as string) || undefined;

      const { jobs, total } = await this._jobService.getJobsByUserId(userId, page, limit, search, sort, status);
      res.status(StatusCodes.OK).json({ jobs, total });
    } catch (error) {
      next(error);
    }
  };

  getDirectJobs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });
        return;
      }
      // We need to find the provider by userId first to get their Provider ID
      const Provider = (await import("../models/providerModel")).default;
      const provider = await Provider.findOne({ userId });
      if (!provider) {
        res.status(StatusCodes.NOT_FOUND).json({ message: "Provider profile not found" });
        return;
      }

      const jobs = await this._jobService.getDirectJobsForProvider(provider._id as string);
      res.status(StatusCodes.OK).json({ jobs });
    } catch (error) {
      next(error);
    }
  };
}

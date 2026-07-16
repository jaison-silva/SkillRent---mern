import { IJobService } from "../interfaces/IJobService";
import { IJobRepository } from "../../repositories/interfaces/IJobRepository";
import { CreateJobRequestDTO, JobResponseDTO } from "../../dto/job/jobDTO";
import ApiError from "../../utils/apiError";
import { StatusCodes } from "http-status-codes";

export class JobService implements IJobService {
  private _jobRepo: IJobRepository;

  constructor(jobRepo: IJobRepository) {
    this._jobRepo = jobRepo;
  }

  async createJob(userId: string, data: CreateJobRequestDTO): Promise<JobResponseDTO> {
    if (!data.title || !data.description || !data.budget || !data.time || !data.location) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Missing required job fields");
    }

    const newJob = await this._jobRepo.createJob(userId, data);
    return newJob as unknown as JobResponseDTO;
  }

  async getAllOpenJobs(page?: number, limit?: number, search?: string, sort?: string): Promise<{ jobs: JobResponseDTO[], total: number }> {
    const result = await this._jobRepo.getAllOpenJobs(page, limit, search, sort);
    return { jobs: result.jobs as unknown as JobResponseDTO[], total: result.total };
  }

  async getJobsByUserId(userId: string, page?: number, limit?: number, search?: string, sort?: string, status?: string): Promise<{ jobs: JobResponseDTO[], total: number }> {
    const result = await this._jobRepo.getJobsByUserId(userId, page, limit, search, sort, status);
    return { jobs: result.jobs as unknown as JobResponseDTO[], total: result.total };
  }

  async getDirectJobsForProvider(providerId: string, page?: number, limit?: number, search?: string, sort?: string): Promise<{ jobs: JobResponseDTO[], total: number }> {
    const result = await this._jobRepo.getDirectJobsForProvider(providerId, page, limit, search, sort);
    return { jobs: result.jobs as unknown as JobResponseDTO[], total: result.total };
  }
}

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

  async updateJob(jobId: string, userId: string, data: Partial<CreateJobRequestDTO>): Promise<JobResponseDTO> {
    const job = await this._jobRepo.findById(jobId);
    if (!job) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
    }
    if (job.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized to update this job");
    }
    
    // Convert location structure if provided
      const updateData: any = { ...data };
    if (data.location) {
      updateData.location = {
        type: "Point",
        coordinates: [data.location.lng, data.location.lat],
        address: data.location.address
      };
    }

    const updatedJob = await this._jobRepo.updateById(jobId, updateData);
    return updatedJob as unknown as JobResponseDTO;
  }

  async deleteJob(jobId: string, userId: string): Promise<void> {
    const job = await this._jobRepo.findById(jobId);
    if (!job) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Job not found");
    }
    if (job.userId.toString() !== userId) {
      throw new ApiError(StatusCodes.FORBIDDEN, "Not authorized to delete this job");
    }
    await this._jobRepo.deleteById(jobId);
  }
}

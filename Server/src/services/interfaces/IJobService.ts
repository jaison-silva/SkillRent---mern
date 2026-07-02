import { CreateJobRequestDTO, JobResponseDTO } from "../../dto/job/jobDTO";

export interface IJobService {
  createJob(userId: string, data: CreateJobRequestDTO): Promise<JobResponseDTO>;
  getAllOpenJobs(page?: number, limit?: number, search?: string, sort?: string): Promise<{ jobs: JobResponseDTO[], total: number }>;
  getJobsByUserId(userId: string, page?: number, limit?: number, search?: string, sort?: string, status?: string): Promise<{ jobs: JobResponseDTO[], total: number }>;
  getDirectJobsForProvider(providerId: string, page?: number, limit?: number, search?: string, sort?: string): Promise<{ jobs: JobResponseDTO[], total: number }>;
}

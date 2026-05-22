import { IJob } from "../../models/jobModel";
import { CreateJobRequestDTO } from "../../dto/job/jobDTO";
import { IBaseRepository } from "./IBaseRepository";

export interface IJobRepository extends IBaseRepository<IJob> {
  createJob(userId: string, data: CreateJobRequestDTO): Promise<IJob>;
  getAllOpenJobs(): Promise<IJob[]>;
  getJobsByUserId(userId: string, page?: number, limit?: number, search?: string, sort?: string, status?: string): Promise<{ jobs: IJob[], total: number }>;
  getDirectJobsForProvider(providerId: string): Promise<IJob[]>;
}

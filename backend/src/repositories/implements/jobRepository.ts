import Job, { IJob } from "../../models/jobModel";
import { IJobRepository } from "../interfaces/IJobRepository";
import { CreateJobRequestDTO } from "../../dto/job/jobDTO";
import { BaseRepository } from "./baseRepository";

export class MongoJobRepository extends BaseRepository<IJob> implements IJobRepository {
  constructor() {
    super(Job);
  }

  async createJob(userId: string, data: CreateJobRequestDTO): Promise<IJob> {
    const job = new Job({
      userId,
      ...data,
      status: 'open'
    });
    return await job.save();
  }

  async getAllOpenJobs(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: string = "newest"
  ): Promise<{ jobs: IJob[], total: number }> {
    const query: Record<string, unknown> = { status: 'open', providerId: { $exists: false } };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "budget_high") sortOption = { budget: -1 };
    if (sort === "budget_low") sortOption = { budget: 1 };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query).populate('userId', 'name profilePicture').sort(sortOption).skip(skip).limit(limit),
      Job.countDocuments(query)
    ]);

    return { jobs, total };
  }

  async getDirectJobsForProvider(
    providerId: string,
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: string = "newest"
  ): Promise<{ jobs: IJob[], total: number }> {
    const query: Record<string, unknown> = { providerId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "budget_high") sortOption = { budget: -1 };
    if (sort === "budget_low") sortOption = { budget: 1 };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query).populate('userId', 'name profilePicture').sort(sortOption).skip(skip).limit(limit),
      Job.countDocuments(query)
    ]);

    return { jobs, total };
  }

  async getJobsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = "",
    sort: string = "newest",
    status?: string
  ): Promise<{ jobs: IJob[], total: number }> {
    const query: Record<string, unknown> = { userId };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (status && status !== "all") {
      query.status = status;
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "budget_high") sortOption = { budget: -1 };
    if (sort === "budget_low") sortOption = { budget: 1 };

    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query).sort(sortOption).skip(skip).limit(limit),
      Job.countDocuments(query)
    ]);

    return { jobs, total };
  }
}

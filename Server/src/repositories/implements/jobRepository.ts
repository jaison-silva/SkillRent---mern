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

  async getAllOpenJobs(): Promise<IJob[]> {
    return await Job.find({ status: 'open', providerId: { $exists: false } }).populate('userId', 'name profilePicture').sort({ createdAt: -1 });
  }

  async getDirectJobsForProvider(providerId: string): Promise<IJob[]> {
    return await Job.find({ providerId }).populate('userId', 'name profilePicture').sort({ createdAt: -1 });
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

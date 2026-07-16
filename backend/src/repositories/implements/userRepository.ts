import User from "../../models/userModel";
import { IUser } from "../../models/userModel";
import IUserRepository from "../interfaces/IUserRepository";
import logger from "../../utils/logger";
import { BaseRepository } from "./baseRepository";

export default class MongoUserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findUsers(page: number = 1, limit: number = 10, search: string = "") {
    const query: Record<string, unknown> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.model.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
      this.model.countDocuments(query)
    ]);

    return { users, total };
  }

  async findUserById(id: string) {
    return await this.findById(id);
  }

  async updateUserById(id: string, updateData: Partial<IUser>) {
    logger.info(`[userRepo] Updating user ${id} with: ${JSON.stringify(updateData)}`);
    const result = await this.model.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    logger.info(`[userRepo] Updated result name: ${result?.name}`);
    return result;
  }

  async blockUserById(id: string, isBanned: boolean) {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: { isBanned } },
      { new: true }
    );
  }
}
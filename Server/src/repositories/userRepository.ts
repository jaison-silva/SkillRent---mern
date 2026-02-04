import User from "../models/userModel";
import { IUser } from "../models/userModel";
import IUserhRepository from "../interfaces/IUserRepository";

export default class MongoUserRepository implements IUserhRepository {

  async findUsers(filter?: Record<string, any>, page: number = 1, limit: number = 6) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter || {}).select("-password -refreshToken").skip(skip).limit(limit),
      User.countDocuments(filter || {})
    ]);

    return { users, total };
  }

  async findUserById(id: string) {
    return await User.findById(id);
  };

  async updateUserById(id: string, updateData: Partial<IUser>) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData }
    )
  }

  async blockUserById(id: string, isBanned: boolean) {
    return await User.findByIdAndUpdate(
      id,
      { $set: { isBanned } },
      { new: true } // ithu full docu update akkum 
    )
  }

} 
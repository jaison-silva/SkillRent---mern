import { IUser } from "../../models/userModel";
import { IBaseRepository } from "./IBaseRepository";

export default interface IUserRepository extends IBaseRepository<IUser> {

    findUsers(page?: number, limit?: number, search?: string): Promise<{ users: IUser[], total: number }>;

    findUserById(id: string): Promise<IUser | null>;

    updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;

    blockUserById(id: string, isBanned: boolean): Promise<IUser | null>;

} 
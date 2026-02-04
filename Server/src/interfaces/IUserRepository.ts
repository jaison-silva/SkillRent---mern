import { IUser } from "../models/userModel";

export default interface IUserRepository {

    findUsers(filter?: Record<string, any>, page?: number, limit?: number): Promise<{ users: IUser[], total: number }>;

    findUserById(id: string): Promise<IUser | null>;

    updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;

    blockUserById(id: string, isBanned: boolean): Promise<IUser | null>;

} 
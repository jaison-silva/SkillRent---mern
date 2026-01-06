import { IUser } from "../models/userModel";

export default interface IUserRepository {

    findUsers(): Promise<IUser[]>; 

    findUserById(id: string): Promise<IUser | null>;

    updateUserById(id: string, updateData: Partial<IUser>): Promise<IUser | null>;

    blockUserById(id: string, isBanned: boolean): Promise<IUser | null>;

} 
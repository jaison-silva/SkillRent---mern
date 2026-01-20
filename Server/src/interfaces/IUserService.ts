import { IUser } from "../models/userModel";

export interface IUserService {

  getHomeData(userId: string): Promise<{
    name: string;
    welcomeMessage: string;
    lastLogin: Date;
  }>;

  userProfileService(userId: string): Promise<IUser>;  
  
  updateUserProfileService(userId: string, updateData: Partial<IUser>): Promise<IUser>;

  getUserDetailsService(id: string): Promise<IUser>;

  listAllUsersService(): Promise<IUser[]>;
}

import { ProviderStatus } from "../../enum/providerStatusEnum";
import { IUser } from "../../models/userModel";
import { IProvider } from "../../models/providerModel";

export interface IAdminService {
  blockUserService(id: string, isBanned: boolean): Promise<IUser | null>;

  blockProviderService(id: string, isBanned: boolean): Promise<IProvider | null>;

  listUsersAndProviders(page?: number, limit?: number, search?: string): Promise<{
    users: IUser[] | null;
    totalUsers: number;
    providers: any[] | null;
    totalProviders: number;
  }>;

  verifyProviderService(id: string, status: ProviderStatus): Promise<IProvider | null>;
}

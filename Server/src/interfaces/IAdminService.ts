import { ProviderStatus } from "../enum/providerStatusEnum";
import { IUser } from "../models/userModel";
import { IProvider } from "../models/providerModel";

export interface IAdminService {
  blockUserService(id: string, isBanned: boolean): Promise<IUser | null>;

  blockProviderService(id: string, isBanned: boolean): Promise<IProvider | null>;

  listUsersAndProviders(): Promise<{
    users: IUser[] | null;
    providers: IProvider[] | null;
  }>;

  verifyProviderService(id: string, status: ProviderStatus): Promise<IProvider | null>;
}

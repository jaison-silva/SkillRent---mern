import providerRepository from "../repositories/providerRepository";
import IUserRepository from "../interfaces/IUserRepository";
import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";
import { IProviderService } from "../interfaces/IProviderService";

export default class ProviderService implements IProviderService {
  constructor(
    private providerRepo: providerRepository,
    private userRepo: IUserRepository
  ) { }

  providerProfileService(userId: string) {
    return this.providerRepo.findByUserId(userId);
  }

  async updateProviderProfileService(userId: string, data: UpdateProviderProfileDTO & { name?: string }) {
    const { name, ...providerData } = data;

    // Update provider and user in parallel if name is provided
    const updatePromises: Promise<any>[] = [
      this.providerRepo.updateProviderByUserId(userId, providerData)
    ];

    if (name) {
      updatePromises.push(this.userRepo.updateUserById(userId, { name }));
    }

    const [updatedProvider] = await Promise.all(updatePromises);

    // Re-fetch to get populated user info
    return this.providerRepo.findByUserId(userId);
  }

  listProviderService(filter?: Record<string, any>, page?: number, limit?: number) {
    return this.providerRepo.listProviders(filter, page, limit);
  }

  providerDetailService(id: string) {
    return this.providerRepo.findProviderById(id);
  }
}

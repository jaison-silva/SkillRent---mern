import providerRepository from "../../repositories/implements/providerRepository";
import IUserRepository from "../../repositories/interfaces/IUserRepository";
import { UpdateProviderProfileDTO } from "../../dto/provider/updateProviderProfileDTO";
import { IProviderService } from "../interfaces/IProviderService";

export default class ProviderService implements IProviderService {
  constructor(
    private _providerRepo: providerRepository,
    private _userRepo: IUserRepository
  ) { }

  providerProfileService(userId: string) {
    return this._providerRepo.findByUserId(userId);
  }

  async updateProviderProfileService(userId: string, data: UpdateProviderProfileDTO & { name?: string }) {
    const { name, ...providerData } = data;

    // Update provider and user in parallel if name is provided
    const updatePromises: Promise<unknown>[] = [
      this._providerRepo.updateProviderByUserId(userId, providerData)
    ];

    if (name) {
      updatePromises.push(this._userRepo.updateUserById(userId, { name }));
    }

    const [updatedProvider] = await Promise.all(updatePromises);

    // Re-fetch to get populated user info
    return this._providerRepo.findByUserId(userId);
  }

  listProviderService(filter?: Record<string, unknown>, page?: number, limit?: number, search?: string, sort?: string, lat?: number, lng?: number) {
    return this._providerRepo.listProviders(filter, page, limit, search, sort, lat, lng);
  }

  providerDetailService(id: string) {
    return this._providerRepo.findProviderById(id);
  }
}

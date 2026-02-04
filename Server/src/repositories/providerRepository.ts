import Provider, { IProvider } from "../models/providerModel";
import IProviderhRepository from "../interfaces/IProviderRepository";
import { ProviderStatus } from "../enum/providerStatusEnum";
import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";

export default class MongoProviderRepository implements IProviderhRepository {

  async listProviders(filter?: Record<string, any>, page: number = 1, limit: number = 6) {
    const skip = (page - 1) * limit;

    const [providers, total] = await Promise.all([
      Provider.find(filter || {}).populate("userId").skip(skip).limit(limit),
      Provider.countDocuments(filter || {})
    ]);

    return { providers, total };
  }

  findProviderById(id: string): Promise<IProvider | null> {
    return Provider.findById(id).populate("userId") as unknown as Promise<IProvider | null>;
  }

  findByUserId(userId: string) {
    return Provider.findOne({ userId }).populate("userId");
  }

  updateProviderById(id: string, data: UpdateProviderProfileDTO) {
    return Provider.findByIdAndUpdate(id, data, { new: true }); // { new: true } returns the updated document instead of the old one
  }

  updateProviderByUserId(userId: string, data: UpdateProviderProfileDTO) {
    return Provider.findOneAndUpdate({ userId }, data, { new: true });
  }

  verifyProviderById(id: string, validationStatus: ProviderStatus) {
    return Provider.findByIdAndUpdate(id,
      { validationStatus },
      { new: true }
    )
  }
}
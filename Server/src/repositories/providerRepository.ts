import Provider from "../models/Provider";
import IProviderhRepository from "../interfaces/IProviderInterface";

export default class MongoProviderRepository implements IProviderhRepository {
  
  findProviders() {
    return Provider.find()
  }
  
  findProviderById(id: string) {
    return Provider.findById(id)
  }

  updateProviderById(id: string, data: any) {
    return Provider.findByIdAndUpdate(id, data, { new: true }); // { new: true } returns the updated document instead of the old one
  }

  blockProviderById(id: string, isBanned: boolean) {
    return Provider.findById(id)
  }

  verifyProviderById(id: string, status: string) {
    return Provider.findById(id)
  }
}
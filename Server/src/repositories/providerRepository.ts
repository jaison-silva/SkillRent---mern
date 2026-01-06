import Provider from "../models/providerModel";
import IProviderhRepository from "../interfaces/IProviderRepo";

export default class MongoProviderRepository implements IProviderhRepository {
   
  listProviders() {
    return Provider.find()
  }
    
  findProviderById(id: string) {
    return Provider.findById(id)
  } 

  updateProviderById(id: string, data: object) {
    return Provider.findByIdAndUpdate(id,data,{ new: true }); // { new: true } returns the updated document instead of the old one
  }

   blockProviderById(id: string, isBanned: boolean) {
    return Provider.findByIdAndUpdate(
      id,
      { isBanned },
      { new: true }
    );
  }

  verifyProviderById(id: string, status: string) {
    return Provider.findByIdAndUpdate(id,
       {isBanned : status},
      {new : true}
    )
  }
}
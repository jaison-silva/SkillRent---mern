import User from "../models/userModel";
import Provider from "../models/providerModel";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { UserRegisterInput, ProviderCreateInput } from "../types/authTypes";
import { SaveOptions } from "mongoose";


export class MongoAuthRepository implements IAuthRepository {
  constructor() { }

  findByEmail(email: string) {
    return User.findOne({ email });
  };

  findById(id: string) {
    return User.findById(id)
  }

  async createUser(data: UserRegisterInput | UserRegisterInput[], options?: SaveOptions) {
    // return User.create(Array.isArray(data) ? data : [data], options);
    const user = new User(data);
    await user.save(options);
    return user;
  };

  async createProvider(data: ProviderCreateInput | ProviderCreateInput[], options?: SaveOptions) {
    // return Provider.create(Array.isArray(data) ? data : [data],options)
    const provider = new Provider(data);
    await provider.save(options);
    return provider;
  }

}
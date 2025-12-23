import User from "../models/User";
import Provider from "../models/Provider";
import { IAuthRepository } from "../interfaces/IAuthInterface";
import { UserRegisterInput, ProviderCreateInput } from "../types/authTypes";
import { SaveOptions } from "mongoose";


export class MongoAuthRepository implements IAuthRepository {
  findByEmail(email: string) {
    return User.findOne({ email });
  };

  findById(id:String){
    return User.findById(id)
  }

  createUser(data: UserRegisterInput | UserRegisterInput[],options?:SaveOptions) {
    return User.create(Array.isArray(data) ? data : [data],options);
  };

  createProvider(data: ProviderCreateInput | ProviderCreateInput[] ,options?:SaveOptions) {
    return Provider.create(Array.isArray(data) ? data : [data],options)
  }

}
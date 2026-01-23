import User from "../models/userModel";
import Provider from "../models/providerModel";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { ProviderCreateInput } from "../dto/register/providerRegisterRequestDTO";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO";
import { IUser } from "../models/userModel";
import { SaveOptions } from "mongoose";


export class MongoAuthRepository implements IAuthRepository {
  constructor() { }

  findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  };

  // async loginCountManage(email: string, count: number){
  //   return await User.findOneAndUpdate({email},{$set: {count}})
  // }

  async updatePasswordByEmail(email: string, hashedPass: string): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPass } },
      { new: true }
    );
  }

  findById(id: string): Promise<IUser | null> {
    return User.findById(id)
  }

  async createUser(data: UserRegisterRequestDTO | UserRegisterRequestDTO[], options?: SaveOptions) {
    // return User.create(Array.isArray(data) ? data : [data], options);
    const user = new User(data);
    await user.save(options);
    return user;
  };

  // async createProvider(data: ProviderCreateInput | ProviderCreateInput[], options?: SaveOptions) {
  async createProvider(data: ProviderCreateInput, options?: SaveOptions) {
    // return Provider.create(Array.isArray(data) ? data : [data],options)
    const provider = new Provider(data);
    await provider.save(options);
    return provider;
  }
  async updateRefreshToken(id: string, token: string | null): Promise<void> {
    await User.findByIdAndUpdate(id, { $set: { refreshToken: token } });
  }

}
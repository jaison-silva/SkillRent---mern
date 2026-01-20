import { SaveOptions } from "mongoose";
import { ProviderCreateInput } from "../dto/register/providerRegisterRequestDTO";
import { IUser } from "../models/userModel";
import { IProvider } from "../models/providerModel";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO";

export interface IAuthRepository {
    findByEmail(email: string): Promise<IUser | null>
    updatePasswordByEmail(email: string, hashedPass: string): Promise<IUser | null>
    findById(id: string): Promise<IUser | null>
    createUser(data: UserRegisterRequestDTO, options?: SaveOptions): Promise<IUser> //| UserRegisterInput[]
    createProvider(data: ProviderCreateInput, options?: SaveOptions): Promise<IProvider> //| ProviderCreateInput[]
    updateRefreshToken(id: string, token: string | null): Promise<void>
}  
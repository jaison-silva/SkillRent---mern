import { UserRegisterInput, ProviderCreateInput } from "../types/authTypes";

export interface IAuthRepository{ // yet to change the any to IUser and all that 
    findByEmail(email: string) : Promise<any>
    createUser(data: UserRegisterInput) : Promise<any>
    createProvider(data: ProviderCreateInput): Promise<any>
}                                                     
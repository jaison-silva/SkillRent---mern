import { SaveOptions } from "mongoose";
import { UserRegisterInput, ProviderCreateInput } from "../types/authTypes";

export interface IAuthRepository { // yet to change the any to IUser and all that 
    findByEmail(email: string): Promise<any>
    updatePasswordByEmail(email: string, hashedPass: string): Promise<any>
    findById(id: string): Promise<any>
    createUser(data: UserRegisterInput, options?: SaveOptions): Promise<any> //| UserRegisterInput[]
    createProvider(data: ProviderCreateInput, options?: SaveOptions): Promise<any> //| ProviderCreateInput[]
}
import {IOtpRepository} from "../interfaces/IOtpRepository";
import User from "../models/userModel";
import OtpModel from "../models/otpModel"

export class OtpRepository implements IOtpRepository {
    constructor() { }

    async saveOtp(email: string, otp: number ,purpose: string) {
        return await OtpModel.create({email,otp,purpose});
    }

    async deleteOtps(email: string, purpose: string) {
        return await OtpModel.deleteMany({ email, purpose });
    }
    
    async findOtp(email: string, purpose: string) {
    return await OtpModel.findOne({ email, purpose });
}
}
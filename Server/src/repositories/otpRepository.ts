import {IOtpRepository} from "../interfaces/IOtpRepository";
import User from "../models/userModel";
import OtpModel from "../models/otpModel"

export class OtpRepository implements IOtpRepository {
    constructor() { }

    async updatePasswordByEmail(email: string, hashedPass: string): Promise<any> {
        return await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedPass } },
            { new: true }
        );
    }

    async saveOtp(otpData: object) {
        return await OtpModel.create(otpData);
    }

    async deleteOldOtps(email: string, purpose: string) {
        return await OtpModel.deleteMany({ email, purpose });
    }
    
    async findOtp(email: string, purpose: string) {
    return await OtpModel.findOne({ email, purpose });
}
}
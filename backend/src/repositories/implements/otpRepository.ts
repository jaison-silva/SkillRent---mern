import { IOtpRepository } from "../interfaces/IOtpRepository"
import User from "../../models/otpModel"; // This is actually OtpModel, named User here
import { IOtp } from "../../models/otpModel";
import { otpStatus } from "../../enum/otpEnum";
import { BaseRepository } from "./baseRepository";

export class OtpRepository extends BaseRepository<IOtp> implements IOtpRepository {
  constructor() {
    super(User);
  }

  async saveOtp(email: string, otp: string, purpose: otpStatus) {
    return await User.create({ email, otp, purpose });
  }

  async deleteOtps(email: string, purpose: otpStatus) {
    await User.deleteMany({ email, purpose });
  }

  async findOtp(email: string, purpose: otpStatus) {
    return await User.findOne({ email, purpose });
  }

  async markAsVerified(email: string, purpose: otpStatus): Promise<void> {
    await User.updateOne(
      { email, purpose },
      {
        $set: {
          isVerified: true,
          verifiedAt: new Date()
        }
      }
    );
  }
}

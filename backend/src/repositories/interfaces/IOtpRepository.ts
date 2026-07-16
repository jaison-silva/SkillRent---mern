import { IOtp } from "../../models/otpModel"
import { otpStatus } from "../../enum/otpEnum";
import { IBaseRepository } from "./IBaseRepository";

export interface IOtpRepository extends IBaseRepository<IOtp> {
  saveOtp(email: string, otp: string, purpose: otpStatus): Promise<IOtp>;
  deleteOtps(email: string, purpose: otpStatus): Promise<void>;
  findOtp(email: string, purpose: otpStatus): Promise<IOtp | null>;
  markAsVerified(email: string, purpose: otpStatus): Promise<void>;
}

import { otpStatus } from "../enum/otpEnum";
import { Document } from "mongodb";

interface IOtp extends Document {
    email: string;
    otp: string;          // hashed OTP
    purpose: otpStatus;

    isVerified: boolean;
    verifiedAt?: Date;

    createdAt: Date;
}

export default IOtp;

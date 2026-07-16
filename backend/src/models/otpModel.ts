import mongoose, { Document } from "mongoose";
import { otpStatus } from "../enum/otpEnum";

export interface IOtp extends Document {
    email: string;
    otp: string;          // hashed OTP
    purpose: otpStatus;

    isVerified: boolean;
    verifiedAt?: Date;

    createdAt: Date;
}

const Otpschema = new mongoose.Schema<IOtp>({
    email: { 
        type: String, 
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    otp: { type: String, required: true },
    purpose: {
        type: String,
        enum: otpStatus,
        required: true
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60
    }
}
)

export default mongoose.model("Otp", Otpschema)
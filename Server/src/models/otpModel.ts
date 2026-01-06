import mongoose from "mongoose";
import IOtp from "../interfaces/IOtpModel";
import { otpStatus } from "../enum/otpEnum";

const Otpschema = new mongoose.Schema<IOtp>({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    purpose: {
        type: String,
        enum: otpStatus,
        required: true
    }, isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600
    }
})

export default mongoose.model("Otp", Otpschema)
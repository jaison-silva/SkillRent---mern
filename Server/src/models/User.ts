import mongoose from "mongoose";
import { UserRoleStatus } from "../enum/userRoleStatus";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String,
         enum: Object.values(UserRoleStatus), // returns a n array os same as [vlaues,vale]
         default: UserRoleStatus.USER },
    lastLogin: {type: Date,default: null},
    isBanned: { type: Boolean, default: false }
},
    { timestamps: true }
)

export default mongoose.model("User", userSchema) 
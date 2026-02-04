import mongoose, { Types, Document } from "mongoose";
import { UserRoleStatus } from "../enum/userRoleStatusEnum";

export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: UserRoleStatus;
    lastLogin: Date | null;
    isBanned: boolean;
    refreshToken: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, default: null, trim: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: Object.values(UserRoleStatus), // returns a n array os same as [vlaues,vale]
        default: UserRoleStatus.USER
    },
    lastLogin: { type: Date, default: null },
    // logincount: { count: Number, default: 0 },
    isBanned: { type: Boolean, default: false },
    refreshToken: { type: String, default: null }
},
    { timestamps: true }
)

export default mongoose.model("User", userSchema) 
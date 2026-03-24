import mongoose, { Types, Document } from "mongoose";
import { UserRoleStatus } from "../enum/userRoleStatusEnum";

export interface IUser extends Document { //Rule of "Colocation" (Keep related things together)
    _id: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: UserRoleStatus;
    lastLogin: Date | null;
    isBanned: boolean;
    refreshToken: string | null;
    googleId?: string;
    authProvider?: 'local' | 'google';
    profilePicture?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address"]
    },
    password: { type: String, required: function (this: any) { return !this.googleId; } },
    googleId: { type: String, unique: true, sparse: true },
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    phone: { type: String, trim: true },
    role: {
        type: String,
        enum: Object.values(UserRoleStatus), // returns a n array os same as [vlaues,vale]
        default: UserRoleStatus.USER
    },
    lastLogin: { type: Date, default: null },
    isBanned: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    profilePicture: { type: String, default: "" }
},
    { timestamps: true }
)

export default mongoose.model("User", userSchema) 
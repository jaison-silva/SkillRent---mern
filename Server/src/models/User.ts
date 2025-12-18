import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "provider"], default: "user" },
    lastLogin: {type: Date,default: null},
    isBanned: { type: Boolean, default: false }
},
    { timestamps: true }
)


const User = mongoose.model("User", userSchema)

export default User
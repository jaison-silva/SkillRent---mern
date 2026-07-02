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
    location?: {
        lat: number;
        lng: number;
    };
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
    password: { type: String, required: function (this: IUser) { return !this.googleId; } },
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
    profilePicture: { type: String, default: "" },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] }, // [lng, lat]
    }
},
    { timestamps: true }
)

userSchema.index({ location: "2dsphere" });

// Middleware to convert {lat, lng} to GeoJSON on save
userSchema.pre("save", function (next) {
  if (this.location && (this.location as any).lat !== undefined && (this.location as any).lng !== undefined) {
    const loc = this.location as any;
    this.location = {
      type: "Point",
      coordinates: [loc.lng, loc.lat]
    } as any;
  }
  next();
});

// Middleware to convert on update
userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update) {
    if (update.$set && update.$set.location && update.$set.location.lat !== undefined && update.$set.location.lng !== undefined) {
      const loc = update.$set.location;
      update.$set.location = {
        type: "Point",
        coordinates: [loc.lng, loc.lat]
      };
    } else if (update.location && update.location.lat !== undefined && update.location.lng !== undefined) {
      const loc = update.location;
      update.location = {
        type: "Point",
        coordinates: [loc.lng, loc.lat]
      };
    }
  }
  next();
});

// Transform to convert GeoJSON back to {lat, lng}
const transformLocation = (doc: any, ret: any) => {
  if (ret.location && ret.location.coordinates) {
    ret.location = {
      lat: ret.location.coordinates[1],
      lng: ret.location.coordinates[0]
    };
  }
  return ret;
};

userSchema.set("toJSON", { transform: transformLocation, virtuals: true });
userSchema.set("toObject", { transform: transformLocation, virtuals: true });

export default mongoose.model("User", userSchema) 
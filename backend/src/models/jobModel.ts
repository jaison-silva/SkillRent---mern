import mongoose, { Types, Document } from "mongoose";

export interface IJob extends Document {
  userId: Types.ObjectId; // Reference to User
  providerId?: Types.ObjectId; // Reference to Provider for direct requests
  title: string;
  description: string;
  budget: number;
  time: string;
  location: {
    lat?: number;
    lng?: number;
    address: string;
  };
  status: 'open' | 'closed' | 'in-progress';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new mongoose.Schema<IJob>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  time: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number] }, // [lng, lat]
    address: { type: String, required: true }
  } as any,
  status: { type: String, enum: ['open', 'closed', 'in-progress'], default: 'open' }
}, { timestamps: true });

jobSchema.index({ location: "2dsphere" });

// Middleware to convert {lat, lng, address} to GeoJSON on save
jobSchema.pre("save", function (this: any, next) {
  if (this.location && (this.location as any).lat !== undefined && (this.location as any).lng !== undefined) {
    const loc = this.location as any;
    this.location = {
      type: "Point",
      coordinates: [loc.lng, loc.lat],
      address: loc.address
    } as any;
  }
  next();
});

// Middleware to convert on update
jobSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate() as any;
  if (update) {
    if (update.$set && update.$set.location && update.$set.location.lat !== undefined && update.$set.location.lng !== undefined) {
      const loc = update.$set.location;
      update.$set.location = {
        type: "Point",
        coordinates: [loc.lng, loc.lat],
        address: loc.address
      };
    } else if (update.location && update.location.lat !== undefined && update.location.lng !== undefined) {
      const loc = update.location;
      update.location = {
        type: "Point",
        coordinates: [loc.lng, loc.lat],
        address: loc.address
      };
    }
  }
  next();
});

// Transform to convert GeoJSON back to {lat, lng, address}
const transformLocation = (doc: any, ret: any) => {
  if (ret.location && ret.location.coordinates) {
    ret.location = {
      lat: ret.location.coordinates[1],
      lng: ret.location.coordinates[0],
      address: ret.location.address
    };
  }
  return ret;
};

jobSchema.set("toJSON", { transform: transformLocation, virtuals: true });
jobSchema.set("toObject", { transform: transformLocation, virtuals: true });

export default mongoose.model<IJob>("Job", jobSchema);

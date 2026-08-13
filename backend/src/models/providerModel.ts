import mongoose, { Types, Document } from "mongoose";
import { ProviderStatus } from "../enum/providerStatusEnum";

interface IProviderLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface IProvider extends Omit<Document, "location"> {
  userId: Types.ObjectId // | IUser;
  bio?: string;
  skills: string[];
  categories: Types.ObjectId[]; // Referencing Category model
  language: string[];
  hasTransport: boolean;
  workNature: 'online' | 'offline' | 'both';
  location: IProviderLocation;
  rating: number;
  jobCount: number;
  availability: {
    day: string;
    slots: string[];
  }[]; // ithu means an array of obj of {day : asdasdf , slots: a;sdlkjfa}
  validationStatus: ProviderStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const providerModel = new mongoose.Schema<IProvider>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  bio: String,
  skills: [String],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  language: [String],
  hasTransport: Boolean,
  workNature: { 
    type: String, 
    enum: ['online', 'offline', 'both'], 
    default: 'offline' 
  },
  location: {
    type: { type: String, enum: ['Point'] },
    coordinates: { type: [Number] }, // [lng, lat]
    address: String,
  } as any,
  rating: { type: Number, default: 0 },
  jobCount: { type: Number, default: 0 },
  availability: [
    {
      day: String, // e.g. "Monday"
      slots: [String], // e.g. ["09:00-11:00", "14:00-16:00"]
    },
  ],
  validationStatus: {
    type: String,
    enum: Object.values(ProviderStatus), // returns a n array os same as [vlaues,vale]
    default: ProviderStatus.PENDING
  },
  rejectionReason: {
    type: String,
    default: ""
  }
},
  { timestamps: true }
)

providerModel.index({ location: "2dsphere" });

// Middleware to convert {lat, lng, address} to GeoJSON on save
providerModel.pre("save", function (this: any, next) {
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
providerModel.pre("findOneAndUpdate", function (next) {
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

providerModel.set("toJSON", { transform: transformLocation, virtuals: true });
providerModel.set("toObject", { transform: transformLocation, virtuals: true });

export default mongoose.model("Provider", providerModel)
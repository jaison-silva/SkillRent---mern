import mongoose, { Types, Document } from "mongoose";
import { ProviderStatus } from "../enum/providerStatusEnum";

interface IProviderLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface IProvider extends Omit<Document, "location"> {
  userId: Types.ObjectId // | IUser;
  bio?: string;
  skills: string[];
  language: string[];
  hasTransport: boolean;
  location: IProviderLocation;
  rating: number;
  jobCount: number;
  availability: {
    day: string;
    slots: string[];
  }[]; // ithu means an array of obj of {day : asdasdf , slots: a;sdlkjfa}
  validationStatus: ProviderStatus;
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
  language: [String],
  hasTransport: Boolean,
  location: {
    lat: Number,
    lng: Number,
    address: String,
  },
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
},
  { timestamps: true }
)

export default mongoose.model("Provider", providerModel)
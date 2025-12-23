import mongoose from "mongoose";
import { ProviderStatus } from "../enum/ProviderStatus";

const providerModel = new mongoose.Schema({
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
  isBanned: { type: Boolean, default: false }
})

export default mongoose.model("Provider", providerModel)
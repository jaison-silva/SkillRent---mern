import mongoose from "mongoose";

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
})

export default mongoose.model("Provicer",providerModel)
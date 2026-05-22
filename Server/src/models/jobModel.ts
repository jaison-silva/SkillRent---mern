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
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String, required: true }
  },
  status: { type: String, enum: ['open', 'closed', 'in-progress'], default: 'open' }
}, { timestamps: true });

export default mongoose.model<IJob>("Job", jobSchema);

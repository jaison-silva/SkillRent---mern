import mongoose, { Schema, Types, Document } from "mongoose";

export interface IUserMembership extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  status: 'active' | 'expired' | 'cancelled';
  startDate: Date;
  endDate: Date;
  stripeSubscriptionId?: string; // Optional gateway integration ref
  createdAt: Date;
  updatedAt: Date;
}

const userMembershipSchema = new Schema<IUserMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    planId: { type: Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
    status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date, required: true },
    stripeSubscriptionId: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<IUserMembership>("UserMembership", userMembershipSchema);

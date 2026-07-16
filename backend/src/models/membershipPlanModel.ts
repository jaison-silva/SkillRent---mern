import mongoose, { Schema, Document } from "mongoose";

export interface IMembershipPlan extends Document {
  name: string;               // e.g., 'Bronze', 'Silver', 'Gold'
  targetRole: 'user' | 'provider';
  price: number;              // Recurring subscription price
  billingCycle: 'monthly' | 'yearly';
  features: {
    noServiceCharge?: boolean;
    prioritySupport?: boolean;
    proposalLimitBoost?: number; // For providers (e.g., bid on 50 jobs/mo)
    profileBoostFactor?: number; // For providers (gold badge & search priority)
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const membershipPlanSchema = new Schema<IMembershipPlan>(
  {
    name: { type: String, required: true, trim: true },
    targetRole: { type: String, enum: ['user', 'provider'], required: true },
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    features: {
      noServiceCharge: { type: Boolean, default: false },
      prioritySupport: { type: Boolean, default: false },
      proposalLimitBoost: { type: Number, default: 0 },
      profileBoostFactor: { type: Number, default: 1.0 }
    },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IMembershipPlan>("MembershipPlan", membershipPlanSchema);

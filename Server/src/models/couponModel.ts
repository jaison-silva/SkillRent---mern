import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;               // e.g., 'WELCOME20'
  discountType: 'percentage' | 'fixed';
  discountValue: number;      // e.g., 20 for 20% or $20
  minBookingValue: number;    // Minimum price to apply this coupon
  maxDiscountAmount?: number; // Cap for percentage discounts
  startDate: Date;
  expiryDate: Date;
  usageLimit: number;         // Total times this coupon can be used overall
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    minBookingValue: { type: Number, default: 0, min: 0 },
    maxDiscountAmount: { type: Number },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", couponSchema);

import { Types } from "mongoose";

export interface CreateJobRequestDTO {
  title: string;
  description: string;
  budget: number;
  time: string;
  providerId?: string;
  location: {
    lat?: number;
    lng?: number;
    address: string;
  };
}

export interface JobResponseDTO {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
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

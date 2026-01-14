import { ObjectId } from "mongodb";
import { UserRoleStatus } from "../enum/userRoleStatusEnum";

export type UserRegisterInput = {
  name: string;
  email: string;
  password: string,
  otp:number,
  role?: UserRoleStatus
}

export type ProviderRegisterInput = {
  name: string;
  email: string;
  password: string;
  otp:number,
  role: UserRoleStatus.PROVIDER | UserRoleStatus.PROVIDER,
  bio?: string;
  skills?: string[];
  language?: string[];
  hasTransport?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
};

export type ProviderCreateInput = {
  userId: ObjectId;
  bio?: string;
  skills?: string[];
  language?: string[];
  hasTransport?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
};

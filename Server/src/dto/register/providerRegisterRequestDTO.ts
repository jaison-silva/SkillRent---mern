import { ObjectId } from "mongodb";
import { UserRoleStatus } from "../../enum/userRoleStatusEnum";


export interface ProviderRegisterRequestDTO {
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

export type ProviderCreateInput = { // ithu used service to enter data in provider db in authservice
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
}
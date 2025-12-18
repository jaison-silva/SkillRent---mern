//   ├── types/                 ← TypeScript interfaces & types

import { ObjectId } from "mongodb";


export type UserRegisterInput = {
  name: string;
  email: string;
  password: string,
  role?: "user" | "provider" | "admin"
}

export type ProviderRegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "provider" | "user";
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

export default {

}
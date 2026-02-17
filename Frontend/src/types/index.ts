export interface User {
    id: string, 
    name : string, 
    email : string, 
    role : 'user' | 'provider' | 'admin'
    isBanned: boolean
}

export interface ProviderProfile {
  userId: string;
  bio: string;
  skills: string[];
  languages: string[];
  hasTransport: boolean;
  rating: number;
  jobCount: number;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
}
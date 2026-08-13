export interface UpdateProviderProfileDTO {
  bio?: string;
  skills?: string[];
  categories?: string[];
  language?: string[];
  hasTransport?: boolean;
  workNature?: 'online' | 'offline' | 'both';
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  availability?: {
    day: string;
    slots: string[];
  }[];
}

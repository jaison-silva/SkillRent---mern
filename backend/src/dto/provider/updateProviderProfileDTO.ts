export interface UpdateProviderProfileDTO {
  bio?: string;
  skills?: string[];
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

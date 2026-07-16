export interface RefreshResponseDTO {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

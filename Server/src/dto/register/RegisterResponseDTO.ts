// import { ROLES } from "../constants/rolesConstants"

export interface RegisterResponseDTO {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  accessToken: string
  refreshToken: string
}

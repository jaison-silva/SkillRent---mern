import { UserRoleStatus } from "../../enum/userRoleStatusEnum"

export interface UserRegisterRequestDTO {
  name: string
  email: string
  password: string
  otp: number
  role: "user" | "provider"
}

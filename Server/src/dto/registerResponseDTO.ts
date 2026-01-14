// dto/registerResponseDTO.ts
export default interface RegisterResponseDTO {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  accessToken: string
  refreshToken: string
}

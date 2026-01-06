export default interface loginResponse{
      user: {
    id: string
    name: string
    email: string
    role: string
  }
  accessToken: string
  refreshToken: string
}
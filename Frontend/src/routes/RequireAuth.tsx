import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { selectCurrentUser } from "../features/auth/authSlice"

export function RequireAuth() {
  const user = useSelector(selectCurrentUser)

  return user ? <Outlet /> : <Navigate to="/login" replace />
}

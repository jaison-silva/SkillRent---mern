import {useAuth} from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export function PublicRoute({redirectTo = "/home"}){
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to={redirectTo} replace />; // replace back adi work avilla
  }

  return <Outlet />;
}
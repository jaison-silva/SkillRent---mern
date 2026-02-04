import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

type Props = {
  redirectTo?: string;
};

export function ProtectedRoute({ redirectTo = "/login" }: Props) {
  const { accessToken, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  if (!accessToken) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}


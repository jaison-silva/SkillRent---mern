import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { Home } from "../pages/Home";
import { Profile } from "../pages/Profile";
import { Navigate } from "react-router-dom";
import { Register } from "../pages/Register";
import { Login } from "../pages/Login";
import { REGISTER_ROLE } from "../pages/constants/constants";
import { PublicLanding } from "../pages/PublicLanding";
import { PublicRoute } from "./PublicRoute";
import { AdminDashboard } from "../pages/AdminDashboard";
import { PendingApproval } from "../pages/PendingApproval";

export function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/publicLanding" replace />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Route>

      <Route element={<PublicRoute />} />
      <Route path="publicLanding" element={<PublicLanding />} />
      <Route path="login" element={<Login />} />
      <Route
        path="register/user"
        element={<Register role={REGISTER_ROLE.user} />}
      />
      <Route
        path="register/provider"
        element={<Register role={REGISTER_ROLE.provider} />}
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}


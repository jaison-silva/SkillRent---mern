import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../pages/auth/Login";
import RegisterUser from "../pages/auth/RegisterUser";
import RegisterProvider from "../pages/auth/RegisterProvider";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// User pages
import Home from "../pages/user/Home";
import ExploreProviders from "../pages/user/ExploreProviders";
import ProviderDetail from "../pages/user/ProviderDetail";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard";

// Not found
import NotFound from "../pages/NotFound";

import ProtectedRoute from "./ProtectedRoute";

import Navbar from "../components/Navbar";

const AppRoutes = () => {
  return (
    <>
      <Navbar />
      <div className="pt-24 min-h-screen bg-slate-950">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/provider" element={<RegisterProvider />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/explore" element={<ExploreProviders />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
};

export default AppRoutes;

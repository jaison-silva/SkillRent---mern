import { Routes, Route, Navigate } from "react-router-dom";

// Auth pages
import Login from "../pages/auth/Login";
import RegisterUser from "../pages/auth/RegisterUser";
import RegisterProvider from "../pages/auth/RegisterProvider";
import RegisterOtp from "../pages/auth/RegisterOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// User pages
import Home from "../pages/user/Home";
import Profile from "../pages/user/Profile";
import EditProfile from "../pages/user/EditProfile";

// Not found
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/register/user" element={<RegisterUser />} />
      <Route path="/register/provider" element={<RegisterProvider />} />
      <Route path="/register/otp" element={<RegisterOtp />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/home" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

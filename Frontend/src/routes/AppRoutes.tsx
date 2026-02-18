import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../pages/landingPage";
import { RequireAuth } from "./RequireAuth";
import { PersistLogin } from "../features/auth/components/PersistsLogin";
import { Signup } from "../features/auth/pages/SignupPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/signup/:provider" element={<Signup />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<PersistLogin />}>
        <Route element={<MainLayout />}>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<LandingPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}


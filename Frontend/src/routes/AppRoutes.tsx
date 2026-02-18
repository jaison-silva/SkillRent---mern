import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../pages/landingPage";
import { RequireAuth } from "./RequireAuth";
import { PersistLogin } from "../features/auth/components/PersistsLogin";

export function AppRoutes() {
  return (
    <Routes>
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

<Routes>
  <Route element={<PersistLogin />}>
    <Route path="/" element={<MainLayout />}>
      
      {/* PUBLIC ROUTES */}
      <Route index element={<LandingPage />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />

      {/* PROTECTED ROUTES (Any logged in user) */}
      <Route element={<ProtectedRoute />}>
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* PROVIDER ONLY ROUTES */}
      <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
        <Route path="post-skill" element={<PostSkill />} />
        <Route path="dashboard" element={<ProviderDashboard />} />
      </Route>

    </Route>
  </Route>
</Routes>
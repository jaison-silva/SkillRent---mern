import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import LandingPage from "../pages/landingPage";
import { RequireAuth } from "./RequireAuth";
import { PublicRoute } from "./PublicRoute";
import { PersistLogin } from "../features/auth/components/PersistsLogin";
import { Signup } from "../features/auth/pages/SignupPage";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Dashboard from "../pages/Dashboard";
import ProviderDetailsPage from "../features/user/pages/ProviderDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";

export function AppRoutes() {
  return (
    <Provider store={store}>
      <Routes>

        <Route element={<MainLayout />}>
        {/*  // public routes */}
          <Route element={<PublicRoute />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/signup/:role" element={<Signup />} />
          </Route>

      {/*// protected routes */}
          <Route element={<PersistLogin />}>

            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/provider/:id" element={<ProviderDetailsPage />} />
            </Route>

          </Route>

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>

      </Routes>
    </Provider>
  );
}

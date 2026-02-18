import { Routes, Route } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../pages/landingPage";
import { RequireAuth } from "./RequireAuth";
import { PersistLogin } from "../features/auth/components/PersistsLogin";
import { Signup } from "../features/auth/pages/SignupPage";
import { Provider } from "react-redux";
import { store } from "../store/store";
import Dashboard from "../pages/Dashboard";

export function AppRoutes() {
  return (
    <Routes>
      <Provider store={store}>
        <Route element={<MainLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/signup/:role" element={<Signup />} />
          <Route path="/landingPage" element={<LandingPage />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Provider>
    </Routes>
  );
}

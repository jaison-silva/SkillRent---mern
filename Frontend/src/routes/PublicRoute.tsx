import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/auth/authSlice";

export const PublicRoute = () => {
    const user = useSelector(selectCurrentUser);

    // If the user is logged in, they shouldn't be able to access Login/Signup pages.
    // Redirect them to their protected dashboard.
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

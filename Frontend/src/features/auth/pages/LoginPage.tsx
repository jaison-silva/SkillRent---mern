import LoginForm from "../../auth/components/loginForm";
import { useLoginMutation } from "../authApiSlice";
import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../authSlice";
// import { LoginFields } from '../features/auth/types/authSchema';

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      const userData = await login(data).unwrap();
      dispatch(
        setCredentials({
          user: userData.user,
          token: userData.accessToken,
        }),
      );
      navigate("/");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <LoginForm
      onSubmit={handleLogin}
      loading={isLoading}
      error={error ? "Login failed" : undefined}
    />
  );
}

import LoginForm from "../../auth/components/loginForm";
import { useLoginMutation } from "../authApiSlice";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

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
    } catch (err) {
      const error = err as FetchBaseQueryError | SerializedError;

      if ("status" in error) {
        console.log(error.data);
      } else {
        console.log(error.message);
      }
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

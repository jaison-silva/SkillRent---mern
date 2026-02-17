import LoginForm from "../../auth/components/loginForm";
import { useLoginMutation } from "../authApiSlice";

import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function LoginPage() {
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await login(data).unwrap();
      
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

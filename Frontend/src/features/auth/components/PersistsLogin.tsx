import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken, setCredentials } from "../authSlice";
import { useRefreshMutation } from "../authApiSlice";

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh] = useRefreshMutation();
  const token = useSelector(selectCurrentToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        const userData = await refresh().unwrap();

        dispatch(
          setCredentials({
            user: userData.user,
            token: userData.token,
          }),
        );
      } catch (err) {
        console.log("From PersistsLogin Refresh failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!token) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, [token, refresh, dispatch]);

  return isLoading ? <p>Loading session...</p> : <Outlet />;
};

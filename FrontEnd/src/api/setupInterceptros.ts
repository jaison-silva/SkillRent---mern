import axios from "axios";
import type { AuthContextType } from "../context/AuthContext";
import api from "./axios";
import { API_ROUTES } from "../routes/apiRoutes";

export function setupInterceptors(auth: AuthContextType) {
    api.interceptors.request.use((config) => {
        if (auth.accessToken) {
            config.headers.Authorization = `Bearer ${auth.accessToken}`
        }
        return config
    })

    api.interceptors.response.use(
        (res) => res,
        async (error) => {
            const originalReq = error.config

            if (error.response?.status == 401 && !originalReq._retry) {
                try {
                    originalReq._retry = true
                    const res = await axios.post(API_ROUTES.auth.refresh, {}, { withCredentials: true })
                    const { accessToken, user } = res.data

                    auth.setAuth(user, accessToken)

                    originalReq.headers.Authorization =
                        `Bearer ${accessToken}`;

                    return api(originalReq);
                } catch {
                    auth.clearAuth()
                    return Promise.reject(error)
                }
            }

            return Promise.reject(error)
        }
    )
}
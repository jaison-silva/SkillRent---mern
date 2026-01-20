import api from "./axios";

export const getAdminDashboardApi = () => {
    return api.get("/admin/dashboard");
};

export const updateUserStatusApi = (id: string, isBanned: boolean) => {
    return api.patch(`/admin/users/${id}/status`, { isBanned });
};

export const updateProviderStatusApi = (id: string, isBanned: boolean) => {
    return api.patch(`/admin/providers/${id}/status`, { isBanned });
};

export const verifyProviderApi = (id: string, status: "approved" | "denied") => {
    return api.patch(`/admin/providers/${id}/verification`, { status });
};

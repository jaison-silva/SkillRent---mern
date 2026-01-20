import api from "./axios";

export const getProviderProfileApi = () => {
    return api.get("/providers/profile");
};

export const updateProviderProfileApi = (data: any) => {
    return api.patch("/providers/profile", data);
};

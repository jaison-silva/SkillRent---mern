import api from "./axios";

export const getUserProfileApi = () => {
    return api.get("/users/profile");
};

export const updateUserProfileApi = (data: { name: string }) => {
    return api.patch("/users/profile", data);
};

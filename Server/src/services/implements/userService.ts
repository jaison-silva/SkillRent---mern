import IUserRepository from "../../repositories/interfaces/IUserRepository";
import ApiError from "../../utils/apiError";
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IUserService } from "../interfaces/IUserService";
import { IUser } from "../../models/userModel";

class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    async getHomeData(userId: string) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);

        return {
            name: user.name,
            welcomeMessage: `Welcome back, ${user.name}!`,
            lastLogin: new Date()
        };
    }

    async userProfileService(userId: string) {
        const user = await this.userRepository.findUserById(userId);
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return user;
    }

    async updateUserProfileService(userId: string, updateData: Partial<IUser>) {
        const updatedUser = await this.userRepository.updateUserById(userId, updateData);
        if (!updatedUser) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return updatedUser;
    }

    async getUserDetailsService(id: string) {
        const userDetails = await this.userRepository.findUserById(id);
        if (!userDetails) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return userDetails;
    }

    async listAllUsersService(page: number = 1, limit: number = 10, search: string = "") {
        const result = await this.userRepository.findUsers(page, limit, search);
        return result;
    }

}

export default UserService;
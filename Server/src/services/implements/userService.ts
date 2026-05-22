import IUserRepository from "../../repositories/interfaces/IUserRepository";
import ApiError from "../../utils/apiError";
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IUserService } from "../interfaces/IUserService";
import { IUser } from "../../models/userModel";

class UserService implements IUserService {

    constructor(private _userRepository: IUserRepository) { }

    async getHomeData(userId: string) {
        const user = await this._userRepository.findUserById(userId);
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);

        return {
            name: user.name,
            welcomeMessage: `Welcome back, ${user.name}!`,
            lastLogin: new Date()
        };
    }

    async userProfileService(userId: string) {
        const user = await this._userRepository.findUserById(userId);
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return user;
    }

    async updateUserProfileService(userId: string, updateData: Partial<IUser>) {
        const updatedUser = await this._userRepository.updateUserById(userId, updateData);
        if (!updatedUser) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return updatedUser;
    }

    async getUserDetailsService(id: string) {
        const userDetails = await this._userRepository.findUserById(id);
        if (!userDetails) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        return userDetails;
    }

    async listAllUsersService(page: number = 1, limit: number = 10, search: string = "") {
        const result = await this._userRepository.findUsers(page, limit, search);
        return result;
    }

}

export default UserService;
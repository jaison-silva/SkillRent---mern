import IProviderRepository from "../interfaces/IProviderRepository";
import IUserRepository from "../interfaces/IUserRepository";
import { ProviderStatus } from "../enum/providerStatusEnum";
import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessageConstant";


export default class adminService {
    constructor(
        private userRepo: IUserRepository,
        private providerRepo: IProviderRepository
    ) { }

    async blockUserService(id: string, isBanned: boolean) {
        return this.userRepo.blockUserById(id, isBanned);
    }

    async blockProviderService(id: string, isBanned: boolean) {
        return this.providerRepo.blockProviderById(id, isBanned);
    }

    // async listPendingProvidersService(){
    //     return this.userRepo.
    // }

    async listUsersAndProviders() {
        const users = this.userRepo.findUsers()
        const providers = this.providerRepo.listProviders()

        return { users, providers }
    }

    async verifyProviderService(id: string, status: ProviderStatus) {

        const provider = await this.providerRepo.findProviderById(id)
        if(provider.isBanned){
            throw new ApiError(API_RESPONSES.ACCOUNT_DISABLED)
        }

        await this.providerRepo.verifyProviderById(id, status);

        
    }
}


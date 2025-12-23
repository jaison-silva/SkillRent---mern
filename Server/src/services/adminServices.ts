import IProviderRepository from "../interfaces/IProviderInterface";
import IUserRepository from "../interfaces/IUserInterface";
// import { ProviderStatus } from "../enum/ProviderStatus";

export default class adminService {
    constructor(
        private userRepo: IUserRepository,
        private providerRepo: IProviderRepository
    ) { }

    async blockUserService(id: string, isBanned: boolean) {
        return this.userRepo.blockUserById(id,isBanned);
    }
    
    async blockProviderService(id: string, isBanned: boolean) {
        return this.providerRepo.blockProviderById(id,isBanned);
    }
    
        // async listPendingProvidersService(){
        //     return this.userRepo.
        // }

        async listUsersAndProviders(){
            const users = this.userRepo.findUsers()
            const providers = this.providerRepo.findProviders()

            return {users, providers}
        }

    async verifyProviderService(id: string, status: string) {
        // have to check if blocked or not
        return this.providerRepo.verifyProviderById(id, status);
    }
}
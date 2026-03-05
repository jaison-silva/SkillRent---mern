import IProviderRepository from "..//../repositories/interfaces/IProviderRepository";
import IUserRepository from "../../repositories/interfaces/IUserRepository";
import { ProviderStatus } from "../../enum/providerStatusEnum";
import ApiError from "../../utils/apiError";
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IAdminService } from "../interfaces/IAdminService";


import { IEmailService } from "../interfaces/IEmailService";

export default class AdminService implements IAdminService {
    constructor(
        private userRepo: IUserRepository,
        private providerRepo: IProviderRepository,
        private emailService: IEmailService
    ) { }

    async blockUserService(id: string, isBanned: boolean) {
        return this.userRepo.blockUserById(id, isBanned);
    }

    async blockProviderService(id: string, isBanned: boolean) {
        const provider = await this.providerRepo.findProviderById(id);

        if (!provider || !provider.userId) {
            throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        }

        const userId = (provider.userId as any)._id?.toString() ?? provider.userId.toString();

        const updatedUser = await this.userRepo.blockUserById(userId, isBanned);

        if (provider.userId && typeof provider.userId === 'object' && 'email' in provider.userId) {
            const statusMessage = isBanned
                ? "Your provider account has been restricted by the administrator."
                : "Your provider account access has been restored.";
            await this.emailService.sendNotificationEmail(
                (provider.userId as any).email,
                "Account Status Update",
                statusMessage
            );
        }

        return provider;
    }

    // async listPendingProvidersService(){
    //     return this.userRepo.
    // }

    async listUsersAndProviders(page: number = 1, limit: number = 10, search: string = "") {
        const { users, total } = await this.userRepo.findUsers(page, limit, search);
        const providers = await this.providerRepo.listProviders()

        return { users, totalUsers: total, providers }
    }

    async verifyProviderService(id: string, status: ProviderStatus) {
        console.log(`AdminService.verifyProviderService: Verifying provider ${id} with status ${status}`);

        try {
            const provider = await this.providerRepo.findProviderById(id)

            if (!provider) {
                console.error(`AdminService.verifyProviderService: Provider ${id} not found`);
                throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
            }

            const userIsBanned = provider.userId &&
                typeof provider.userId === 'object' &&
                'isBanned' in provider.userId &&
                (provider.userId as any).isBanned;

            if (userIsBanned) {
                console.error(`AdminService.verifyProviderService: Provider ${id}'s user is banned`);
                throw new ApiError(StatusCodes.FORBIDDEN, API_RESPONSES.ACCOUNT_DISABLED);
            }

            console.log(`AdminService.verifyProviderService: Updating status in DB...`);
            const updatedProvider = await this.providerRepo.verifyProviderById(id, status);

            if (provider.userId && typeof provider.userId === 'object' && 'email' in provider.userId) {
                const email = (provider.userId as any).email;
                const subject = status === "approved" ? "Application Approved!" : "Application Update";
                const message = status === "approved"
                    ? "Congratulations! Your provider profile has been verified and you can now accept bookings."
                    : "We regret to inform you that your provider application has been denied at this time.";

                console.log(`AdminService.verifyProviderService: Sending notification email to ${email}...`);
                try {
                    await this.emailService.sendNotificationEmail(email, subject, message);
                } catch (emailErr) {
                    console.error("AdminService.verifyProviderService: Email notification failed, but DB was updated.", emailErr);
                }
            } else {
                console.warn(`AdminService.verifyProviderService: No email found for provider ${id}, skipping notification.`);
            }

            return updatedProvider;
        } catch (err) {
            console.error("AdminService.verifyProviderService: FAILED", err);
            throw err;
        }
    }
}

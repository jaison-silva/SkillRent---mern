import IProviderRepository from "../interfaces/IProviderRepository";
import IUserRepository from "../interfaces/IUserRepository";
import { ProviderStatus } from "../enum/providerStatusEnum";
import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessageConstant";
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
            throw new ApiError(API_RESPONSES.NOT_FOUND);
        }

        // Get the userId - it could be populated (object with _id) or just an ObjectId
        const userId = (provider.userId as any)._id?.toString() ?? provider.userId.toString();

        // Ban the USER, not the provider
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

        return provider; // Return provider for consistency with interface
    }

    // async listPendingProvidersService(){
    //     return this.userRepo.
    // }

    async listUsersAndProviders() {
        const users = await this.userRepo.findUsers()
        const providers = await this.providerRepo.listProviders()

        return { users, providers }
    }

    async verifyProviderService(id: string, status: ProviderStatus) {
        console.log(`AdminService.verifyProviderService: Verifying provider ${id} with status ${status}`);

        try {
            const provider = await this.providerRepo.findProviderById(id)

            if (!provider) {
                console.error(`AdminService.verifyProviderService: Provider ${id} not found`);
                throw new ApiError(API_RESPONSES.NOT_FOUND);
            }

            // Check if the associated user is banned (via populated userId)
            const userIsBanned = provider.userId &&
                typeof provider.userId === 'object' &&
                'isBanned' in provider.userId &&
                (provider.userId as any).isBanned;

            if (userIsBanned) {
                console.error(`AdminService.verifyProviderService: Provider ${id}'s user is banned`);
                throw new ApiError(API_RESPONSES.ACCOUNT_DISABLED);
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
                    // We don't necessarily want to fail the whole request if just the email fails
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

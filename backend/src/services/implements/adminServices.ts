import IProviderRepository from "..//../repositories/interfaces/IProviderRepository";
import IUserRepository from "../../repositories/interfaces/IUserRepository";
import { ProviderStatus } from "../../enum/providerStatusEnum";
import ApiError from "../../utils/apiError";
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IAdminService } from "../interfaces/IAdminService";
import logger from "../../utils/logger";


import { IEmailService } from "../interfaces/IEmailService";

export default class AdminService implements IAdminService {
    constructor(
        private _userRepo: IUserRepository,
        private _providerRepo: IProviderRepository,
        private _emailService: IEmailService
    ) { }

    async blockUserService(id: string, isBanned: boolean) {
        return this._userRepo.blockUserById(id, isBanned);
    }

    async blockProviderService(id: string, isBanned: boolean) {
        const provider = await this._providerRepo.findProviderById(id);

        if (!provider || !provider.userId) {
            throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        }

        const userId = (provider.userId as unknown as { _id?: { toString(): string } })._id?.toString() ?? provider.userId.toString();

        const updatedUser = await this._userRepo.blockUserById(userId, isBanned);

        if (provider.userId && typeof provider.userId === 'object' && 'email' in provider.userId) {
            const statusMessage = isBanned
                ? "Your provider account has been restricted by the administrator."
                : "Your provider account access has been restored.";
            await this._emailService.sendNotificationEmail(
                (provider.userId as unknown as { email: string }).email,
                "Account Status Update",
                statusMessage
            );
        }

        return provider;
    }

    // async listPendingProvidersService(){
    //     return this._userRepo.
    // }

    async listUsersAndProviders(page: number = 1, limit: number = 10, search: string = "") {
        const { users, total } = await this._userRepo.findUsers(page, limit, search);
        const { providers, total: totalProviders } = await this._providerRepo.listProviders({ validationStatus: 'pending' }, page, limit, search);

        return { users, totalUsers: total, providers, totalProviders }
    }

    async verifyProviderService(id: string, status: ProviderStatus, reason?: string) {
        logger.info(`AdminService.verifyProviderService: Verifying provider ${id} with status ${status}`);

        try {
            const provider = await this._providerRepo.findProviderById(id)

            if (!provider) {
                logger.error(`AdminService.verifyProviderService: Provider ${id} not found`);
                throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
            }

            const userIsBanned = provider.userId &&
                typeof provider.userId === 'object' &&
                'isBanned' in provider.userId &&
                (provider.userId as unknown as { isBanned: boolean }).isBanned;

            if (userIsBanned) {
                logger.error(`AdminService.verifyProviderService: Provider ${id}'s user is banned`);
                throw new ApiError(StatusCodes.FORBIDDEN, API_RESPONSES.ACCOUNT_DISABLED);
            }

            logger.info(`AdminService.verifyProviderService: Updating status in DB...`);
            const updatedProvider = await this._providerRepo.verifyProviderById(id, status, reason);

            if (provider.userId && typeof provider.userId === 'object' && 'email' in provider.userId) {
                const email = (provider.userId as unknown as { email: string }).email;
                const subject = status === "approved" ? "Application Approved!" : "Application Update";
                const message = status === "approved"
                    ? "Congratulations! Your provider profile has been verified and you can now accept bookings."
                    : `We regret to inform you that your provider application has been denied at this time.\n\nReason: ${reason || "No reason provided."}\n\nPlease update your profile and try again.`;

                logger.info(`AdminService.verifyProviderService: Sending notification email to ${email}...`);
                try {
                    await this._emailService.sendNotificationEmail(email, subject, message);
                } catch (emailErr) {
                    logger.error("AdminService.verifyProviderService: Email notification failed, but DB was updated.", emailErr);
                }
            } else {
                logger.warn(`AdminService.verifyProviderService: No email found for provider ${id}, skipping notification.`);
            }

            return updatedProvider;
        } catch (err) {
            logger.error("AdminService.verifyProviderService: FAILED", err);
            throw err;
        }
    }
}

export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<void>;
    sendNotificationEmail(email: string, subject: string, message: string): Promise<void>;
}
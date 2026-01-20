import nodemailer from "nodemailer";
import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessageConstant";
// import ApiError from "../utils/apiError";
// import { API_RESPONSES } from "../constants/status_messages";

class EmailService {
  private _transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for others
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendOtpEmail(email: string, otp: string) {
    try {
      await this._transporter.sendMail({
        from: `"SkillRent" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Verify Your Account</h2>
            <p>Your OTP code is:</p>
            <h1 style="background: #f3f4f6; display: inline-block; padding: 10px 20px; border-radius: 8px;">${otp}</h1>
            <p>This code will expire in 5 minutes.</p>
          </div>
        `
      });
    } catch (error) {
      throw new ApiError(API_RESPONSES.EMAIL_SERVICE_FAILED);
    }
  }

  async sendNotificationEmail(email: string, subject: string, message: string) {
    try {
      await this._transporter.sendMail({
        from: `"SkillRent Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: subject,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2563eb;">Account Update</h2>
            <p>${message}</p>
            <p>If you have any questions, please contact our support team.</p>
            <footer style="margin-top: 20px; color: #666; font-size: 12px;">SkillRent Platform Team</footer>
          </div>
        `
      });
    } catch (error) {
      console.error("Email notification failed:", error);
    }
  }
}

export { EmailService };

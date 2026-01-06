import nodemailer from "nodemailer";
import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessages";
// import ApiError from "../utils/apiError";
// import { API_RESPONSES } from "../constants/status_messages";

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
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
      await this.transporter.sendMail({
        from: `"Your App" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
          <p>Your OTP code is:</p>
          <h2>${otp}</h2>
          <p>This code will expire in 5 minutes.</p>
        `
      });
    } catch (error) {
     throw new ApiError(API_RESPONSES.EMAIL_SERVICE_FAILED);
    }
  }
}

export default new EmailService();

export const REGISTER_ROLE = {
    user: "user",
    provider: "provider"
} as const

export const REGISTER_STEPS = {
    SEND_OTP: "SEND_OTP",
    VERIFY_OTP: "VERIFY_OTP",
    REGISTER: "REGISTER",
} as const;

// export enum otpStatus {
//     VERIFICATION = "verification",
//     FORGOT_PASSWORD = "forgot_password"
// }

export const OTP_STATUS = {
    VERIFICATION : "verification",
    FORGOT_PASSWORD : "forgot_password"
} as const
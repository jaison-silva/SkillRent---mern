export const API_RESPONSES = {
  // ─────────────────────────
  // SUCCESS RESPONSES (2xx)
  // ─────────────────────────
  SUCCESS: "Operation successful.",
  CREATED: "Resource created successfully.",
  DELETED: "Resource deleted successfully.",

  // ─────────────────────────
  // AUTH & ACCOUNT
  // ─────────────────────────
  LOGIN_SUCCESS: "Login successful.",
  LOGIN_FAILED: "Invalid username or password.",
  UNAUTHORIZED: "You must be logged in to access this.",
  FORBIDDEN: "You do not have permission to perform this action.",
  REGISTER_SUCCESS: "Registration successful. Please verify OTP.",

  // ─────────────────────────
  // OTP & VERIFICATION
  // ─────────────────────────
  OTP_SENT: "OTP sent to your email.",
  OTP_VERIFIED: "OTP verified successfully.",
  OTP_INVALID: "Invalid OTP provided.",
  OTP_EXPIRED: "OTP has expired. Please request a new one.",

  // ─────────────────────────
  // RESOURCE ERRORS (4xx) 
  // ─────────────────────────
  NOT_FOUND: "The requested resource was not found.",
  ALREADY_EXISTS: "Resource already exists.",
  VALIDATION_ERROR: "Invalid data provided.",
  TOO_MANY_REQUESTS: "Rate limit exceeded. Try again later.",

  // ─────────────────────────
  // FILE UPLOAD
  // ─────────────────────────
  UPLOAD_SUCCESS: "File uploaded successfully.",
  UPLOAD_FAILED: "File upload failed. Check file type/size.",

  // ─────────────────────────
  // SERVER ERRORS (5xx)
  // ─────────────────────────
  SERVER_ERROR: "An internal server error occurred.",
  SERVICE_UNAVAILABLE: "Service is temporarily down for maintenance.",

  // ─────────────────────────
  // AUTH / TOKEN (extra)
  // ─────────────────────────
  TOKEN_MISSING: "Authentication token is missing.",
  TOKEN_INVALID: "Invalid authentication token.",
  TOKEN_EXPIRED: "Authentication token has expired.",
  TOKEN_REFRESHED: "Token refreshed successfully.",
  LOGOUT_SUCCESS: "Logout successful.",

  // ─────────────────────────
  // USER / ACCOUNT (extra)
  // ─────────────────────────
  USER_NOT_FOUND: "User not found.",
  EMAIL_ALREADY_EXISTS: "Email already exists.",
  USERNAME_ALREADY_EXISTS: "Username already exists.",
  ACCOUNT_VERIFIED: "Account verified successfully.",
  ACCOUNT_DISABLED: "This account has been disabled.",
  ACCOUNT_LOCKED: "Account locked due to multiple failed attempts.",

  // ─────────────────────────
  // PASSWORD / SECURITY
  // ─────────────────────────
  PASSWORD_UPDATED: "Password updated successfully.",
  OLD_PASSWORD_INCORRECT: "Old password is incorrect.",
  PASSWORD_RESET_REQUIRED: "Password reset is required.",

  // ─────────────────────────
  // REQUEST / VALIDATION (extra)
  // ─────────────────────────
  MISSING_REQUIRED_FIELDS: "Required fields are missing.",
  INVALID_EMAIL_FORMAT: "Invalid email format.",
  INVALID_PHONE_FORMAT: "Invalid phone number format.",
  INVALID_ID_FORMAT: "Invalid ID format.",

  // ─────────────────────────
  // OTP / RATE LIMIT (extra)
  // ─────────────────────────
  OTP_ALREADY_USED: "OTP has already been used.",
  OTP_ATTEMPTS_EXCEEDED: "Maximum OTP attempts exceeded.",
  OTP_NOT_VERIFIED: "OTP has not been verified.",

  // ─────────────────────────
  // FILE / MEDIA (extra)
  // ─────────────────────────
  FILE_TOO_LARGE: "Uploaded file is too large.",
  UNSUPPORTED_FILE_TYPE: "Unsupported file type.",
  FILE_NOT_FOUND: "File not found.",

  // ─────────────────────────
  // DATABASE / INTERNAL
  // ─────────────────────────
  DB_ERROR: "Database operation failed.",
  DUPLICATE_KEY_ERROR: "Duplicate key error.",
  DATA_INTEGRITY_ERROR: "Data integrity violation.",

  // ─────────────────────────
  // EXTERNAL SERVICES
  // ─────────────────────────
  EMAIL_SERVICE_FAILED: "Failed to send email.",
  PAYMENT_SERVICE_FAILED: "Payment service failed.",
  THIRD_PARTY_TIMEOUT: "Third-party service timed out.",

  // ─────────────────────────
  // SERVER / INFRA (extra)
  // ─────────────────────────
  INTERNAL_SERVER_ERROR: "An unexpected error occurred while creating the resource.",
  NOT_IMPLEMENTED: "This feature is not implemented yet.",
  GATEWAY_TIMEOUT: "Gateway timeout.",

} as const


// Helpful Type (auto-updates as you add more)
// export type ApiResponseKey = keyof typeof API_RESPONSES;

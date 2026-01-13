export const API_RESPONSES = {
  // ─────────────────────────
  // SUCCESS RESPONSES (2xx)
  // ─────────────────────────
  SUCCESS: { status: 200, message: "Operation successful." },
  CREATED: { status: 201, message: "Resource created successfully." },
  DELETED: { status: 200, message: "Resource deleted successfully." },

  // ─────────────────────────
  // AUTH & ACCOUNT
  // ─────────────────────────
  LOGIN_SUCCESS: { status: 200, message: "Login successful." },
  LOGIN_FAILED: { status: 401, message: "Invalid username or password." },
  UNAUTHORIZED: { status: 401, message: "You must be logged in to access this." },
  FORBIDDEN: { status: 403, message: "You do not have permission to perform this action." },
  REGISTER_SUCCESS: { status: 201, message: "Registration successful. Please verify OTP." },

  // ─────────────────────────
  // OTP & VERIFICATION
  // ─────────────────────────
  OTP_SENT: { status: 200, message: "OTP sent to your email." },
  OTP_VERIFIED: { status: 200, message: "OTP verified successfully." },
  OTP_INVALID: { status: 400, message: "Invalid OTP provided." },
  OTP_EXPIRED: { status: 410, message: "OTP has expired. Please request a new one." },

  // ─────────────────────────
  // RESOURCE ERRORS (4xx) 
  // ─────────────────────────
  NOT_FOUND: { status: 404, message: "The requested resource was not found." },
  ALREADY_EXISTS: { status: 409, message: "Resource already exists." },
  VALIDATION_ERROR: { status: 400, message: "Invalid data provided." },
  TOO_MANY_REQUESTS: { status: 429, message: "Rate limit exceeded. Try again later." },

  // ─────────────────────────
  // FILE UPLOAD
  // ─────────────────────────
  UPLOAD_SUCCESS: { status: 200, message: "File uploaded successfully." },
  UPLOAD_FAILED: { status: 400, message: "File upload failed. Check file type/size." },

  // ─────────────────────────
  // SERVER ERRORS (5xx)
  // ─────────────────────────
  SERVER_ERROR: { status: 500, message: "An internal server error occurred." },
  SERVICE_UNAVAILABLE: { status: 503, message: "Service is temporarily down for maintenance." },

  // ─────────────────────────
  // AUTH / TOKEN (extra)
  // ─────────────────────────
  TOKEN_MISSING: { status: 401, message: "Authentication token is missing." },
  TOKEN_INVALID: { status: 401, message: "Invalid authentication token." },
  TOKEN_EXPIRED: { status: 401, message: "Authentication token has expired." },
  TOKEN_REFRESHED: { status: 200, message: "Token refreshed successfully." },
  LOGOUT_SUCCESS: { status: 200, message: "Logout successful." },

  // ─────────────────────────
  // USER / ACCOUNT (extra)
  // ─────────────────────────
  USER_NOT_FOUND: { status: 404, message: "User not found." },
  EMAIL_ALREADY_EXISTS: { status: 409, message: "Email already exists." },
  USERNAME_ALREADY_EXISTS: { status: 409, message: "Username already exists." },
  ACCOUNT_VERIFIED: { status: 200, message: "Account verified successfully." },
  ACCOUNT_DISABLED: { status: 403, message: "This account has been disabled." },
  ACCOUNT_LOCKED: { status: 423, message: "Account locked due to multiple failed attempts." },

  // ─────────────────────────
  // PASSWORD / SECURITY
  // ─────────────────────────
  PASSWORD_UPDATED: { status: 200, message: "Password updated successfully." },
  OLD_PASSWORD_INCORRECT: { status: 400, message: "Old password is incorrect." },
  PASSWORD_RESET_REQUIRED: { status: 403, message: "Password reset is required." },

  // ─────────────────────────
  // REQUEST / VALIDATION (extra)
  // ─────────────────────────
  MISSING_REQUIRED_FIELDS: { status: 400, message: "Required fields are missing." },
  INVALID_EMAIL_FORMAT: { status: 400, message: "Invalid email format." },
  INVALID_PHONE_FORMAT: { status: 400, message: "Invalid phone number format." },
  INVALID_ID_FORMAT: { status: 400, message: "Invalid ID format." },

  // ─────────────────────────
  // OTP / RATE LIMIT (extra)
  // ─────────────────────────
  OTP_ALREADY_USED: { status: 409, message: "OTP has already been used." },
  OTP_ATTEMPTS_EXCEEDED: { status: 429, message: "Maximum OTP attempts exceeded." },
  OTP_NOT_VERIFIED: { status: 403, message: "OTP has not been verified." },

  // ─────────────────────────
  // FILE / MEDIA (extra)
  // ─────────────────────────
  FILE_TOO_LARGE: { status: 413, message: "Uploaded file is too large." },
  UNSUPPORTED_FILE_TYPE: { status: 415, message: "Unsupported file type." },
  FILE_NOT_FOUND: { status: 404, message: "File not found." },

  // ─────────────────────────
  // DATABASE / INTERNAL
  // ─────────────────────────
  DB_ERROR: { status: 500, message: "Database operation failed." },
  DUPLICATE_KEY_ERROR: { status: 409, message: "Duplicate key error." },
  DATA_INTEGRITY_ERROR: { status: 500, message: "Data integrity violation." },

  // ─────────────────────────
  // EXTERNAL SERVICES
  // ─────────────────────────
  EMAIL_SERVICE_FAILED: { status: 502, message: "Failed to send email." },
  PAYMENT_SERVICE_FAILED: { status: 502, message: "Payment service failed." },
  THIRD_PARTY_TIMEOUT: { status: 504, message: "Third-party service timed out." },

  // ─────────────────────────
  // SERVER / INFRA (extra)
  // ─────────────────────────
  INTERNAL_SERVER_ERROR: { status: 500, message: "An unexpected error occurred while creating the resource." },
  NOT_IMPLEMENTED: { status: 501, message: "This feature is not implemented yet." },
  GATEWAY_TIMEOUT: { status: 504, message: "Gateway timeout." },

} as const


// Helpful Type (auto-updates as you add more)
// export type ApiResponseKey = keyof typeof API_RESPONSES;

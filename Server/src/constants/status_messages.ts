export const API_RESPONSES = {
  // --- SUCCESS RESPONSES (2xx) ---
  SUCCESS: { status: 200, message: "Operation successful." },
  CREATED: { status: 201, message: "Resource created successfully." },
  DELETED: { status: 200, message: "Resource deleted successfully." },
  
  // --- AUTH & ACCOUNT ---
  LOGIN_SUCCESS: { status: 200, message: "Login successful." },
  LOGIN_FAILED: { status: 401, message: "Invalid username or password." },
  UNAUTHORIZED: { status: 401, message: "You must be logged in to access this." },
  FORBIDDEN: { status: 403, message: "You do not have permission to perform this action." },
  REGISTER_SUCCESS: { status: 201, message: "Registration successful. Please verify OTP." },
  
  // --- OTP & VERIFICATION ---
  OTP_SENT: { status: 200, message: "OTP sent to your email." },
  OTP_VERIFIED: { status: 200, message: "OTP verified successfully." },
  OTP_INVALID: { status: 400, message: "Invalid OTP provided." },
  OTP_EXPIRED: { status: 410, message: "OTP has expired. Please request a new one." },

  // --- RESOURCE ERRORS (4xx) ---
  NOT_FOUND: { status: 404, message: "The requested resource was not found." },
  ALREADY_EXISTS: { status: 409, message: "Resource already exists." },
  VALIDATION_ERROR: { status: 400, message: "Invalid data provided." },
  TOO_MANY_REQUESTS: { status: 429, message: "Rate limit exceeded. Try again later." },

  // --- FILE UPLOAD ---
  UPLOAD_SUCCESS: { status: 200, message: "File uploaded successfully." },
  UPLOAD_FAILED: { status: 400, message: "File upload failed. Check file type/size." },

  // --- SERVER ERRORS (5xx) ---
  SERVER_ERROR: { status: 500, message: "An internal server error occurred." },
  SERVICE_UNAVAILABLE: { status: 503, message: "Service is temporarily down for maintenance." },
} as const;

// Helpful Type for your functions
export type ApiResponseKey = keyof typeof API_RESPONSES;
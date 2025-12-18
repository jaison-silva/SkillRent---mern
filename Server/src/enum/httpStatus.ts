// export enum HttpStatusCode {
//   OK = 200,
//   BAD_REQUEST = 400,
//   NOT_FOUND = 404,
//   INTERNAL_SERVER_ERROR = 500,
//   SERVICE_UNAVAILABLE = 503,
// }


export enum HttpStatusCode {
  // 1xx Informational responses
  // CONTINUE = 100, // Rarely used in app logic, more for HTTP protocol
  // SWITCHING_PROTOCOLS = 101,

  // 2xx Success
  OK = 200,
  CREATED = 201, // Resource successfully created (e.g., POST request)
  ACCEPTED = 202, // Request accepted for processing, but processing not yet complete
  NO_CONTENT = 204, // Request successful, but no content to return (e.g., DELETE request)
  PARTIAL_CONTENT = 206, // Used for range requests

  // 3xx Redirection
  MOVED_PERMANENTLY = 301, // Resource moved to a new permanent URL
  FOUND = 302, // Resource temporarily moved
  NOT_MODIFIED = 304, // Client has a cached version that is still valid

  // 4xx Client errors
  BAD_REQUEST = 400, // Generic client error, often due to invalid syntax or missing required fields
  UNAUTHORIZED = 401, // Authentication required or failed (user is not authenticated)
  FORBIDDEN = 403, // Server understands the request but refuses to authorize it (user is authenticated but lacks necessary permissions)
  NOT_FOUND = 404, // Resource not found
  METHOD_NOT_ALLOWED = 405, // HTTP method used is not supported for the resource
  NOT_ACCEPTABLE = 406, // Server cannot produce a response matching the list of acceptable values defined in the request's proactive content negotiation headers
  CONFLICT = 409, // Request conflict, e.g., edit conflict or resource already exists
  GONE = 410, // Resource is no longer available at the server and no forwarding address is known
  UNPROCESSABLE_ENTITY = 422, // The server understands the content type of the request entity, and the syntax of the request entity is correct, but it was unable to process the contained instructions (e.g., validation errors for specific business rules)
  TOO_MANY_REQUESTS = 429, // User has sent too many requests in a given amount of time ("rate limiting")

  // 5xx Server errors
  INTERNAL_SERVER_ERROR = 500, // Generic server error, something went wrong on the server
  NOT_IMPLEMENTED = 501, // Server does not support the functionality required to fulfill the request
  BAD_GATEWAY = 502, // Server acting as a gateway or proxy received an invalid response from an upstream server
  SERVICE_UNAVAILABLE = 503, // Server is not ready to handle the request (e.g., overloaded or down for maintenance)
  GATEWAY_TIMEOUT = 504, // Server acting as a gateway or proxy did not receive a timely response from an upstream server
}
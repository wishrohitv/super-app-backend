/**
 * Base Error Class for the Application
 */
export class AppError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    description = "",
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.description = description;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Client Error Classes (4xx)
 */

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}
export class UnauthorizedError extends AppError {
  constructor(message = "You are not authorized to access this resource") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You are not allowed to access this resource") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "The requested resource was not found") {
    super(404, message);
  }
}

export class RequestTimeoutError extends AppError {
  constructor(message = "The request timed out") {
    super(408, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "A conflict occurred while processing the request") {
    super(409, message);
  }
}

export class ContentTooLargeError extends AppError {
  constructor(message = "The request content is too large") {
    super(413, message);
  }
}

export class ValidationError extends AppError {
  constructor(errors = [], message = "Validation failed") {
    super(422, message, errors);
  }
}

/**
 * Server Error Classes (5xx)
 */

export class InternalServerError extends AppError {
  constructor(message = "An internal server error occurred") {
    super(500, message);
  }
}

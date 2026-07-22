const { AppError } = require("../utils/AppError");

const globalErrorHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const response = {
    success: false,
    message: error.message || "Internal Server Error"
  };

  if (error.details) {
    response.details = error.details;
  }

  if (process.env.NODE_ENV !== "production" && error.stack) {
    response.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = { globalErrorHandler };


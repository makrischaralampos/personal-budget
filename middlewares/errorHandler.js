const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace for debugging purposes

  // Determine the status code (use 500 if it's not provided)
  const statusCode = err.statusCode || 500;

  // Send a JSON response with the error message and status code
  res.status(statusCode).json({
    success: false,
    error: err.message || "Interval Server Error",
  });
};

module.exports = errorHandler;

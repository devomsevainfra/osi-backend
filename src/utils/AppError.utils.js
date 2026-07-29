class AppError extends Error {
  constructor({ httpStatusCode, message, error }) {
    super(message);
    this.httpStatusCode = httpStatusCode;
    this.error = error;
  }
}

export default AppError;

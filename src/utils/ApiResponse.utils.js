class ApiResponse {
  constructor({ httpStatusCode, message, data, error }) {
    this.httpStatusCode = httpStatusCode;
    this.message = message;

    if (httpStatusCode < 400) {
      this.success = true;
      this.data = data;
    } else {
      this.success = false;
      this.error = error;
      this.stack = error.stack;
    }
  }
}

export default ApiResponse;

export class UserCancelledError extends Error {
  constructor(message = 'Setup cancelled.') {
    super(message);
    this.name = 'UserCancelledError';
  }
}

export class FatalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FatalError';
  }
}

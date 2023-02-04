export class UserNotConfirmedException extends Error {
  constructor(message?: string) {
    super(message ?? "User is not confirmed yet");
  }
}
export class NotAuthorizedException extends Error {
  constructor(message?: string) {
    super(message ?? "Not authorized");
  }
}

export class AuthProviderException extends Error {
  constructor(message?: string) {
    super(message ?? "Auth provider error");
  }
}

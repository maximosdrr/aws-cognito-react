export interface SignUpParams {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface SignUpResult {
  userConfirmed: boolean;
}

export interface UserSession {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface User {
  username: string;
  email: string;
}

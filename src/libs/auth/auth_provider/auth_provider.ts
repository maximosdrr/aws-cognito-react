import {
  SignInParams,
  SignUpParams,
  SignUpResult,
  User,
  UserSession,
} from "./interfaces";

export abstract class AuthProvider {
  abstract signUp(params: SignUpParams): Promise<SignUpResult>;
  abstract signIn(params: SignInParams): Promise<UserSession>;
  abstract confirmSignUp(username: string, code: string): Promise<void>;
  abstract sendConfirmationCode(username: string): Promise<void>;
  abstract refreshSession(): Promise<void>;
  abstract signOut(): Promise<void>;
  abstract getCurrentUser(): Promise<User>;
  abstract resetPassword(username: string): Promise<void>;
}

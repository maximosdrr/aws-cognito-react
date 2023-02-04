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
  abstract getCurrentUser(): User;

  getUserSession(): UserSession {
    const session = localStorage.getItem("USER_SESSION");
    return session ? JSON.parse(session) : null;
  }

  setUserSession(session: UserSession) {
    localStorage.setItem("USER_SESSION", JSON.stringify(session));
  }
}

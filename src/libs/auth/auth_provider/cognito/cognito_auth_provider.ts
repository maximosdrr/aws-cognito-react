import { CognitoUserAttribute } from "amazon-cognito-identity-js";
import { SignUpResult, User, UserSession } from "../interfaces";
import { AwsCognito } from "./aws-cognito";
import { SignUpParams, SignInParams } from "../interfaces";
import { AuthProvider } from "../auth_provider";
import {
  AuthProviderException,
  NotAuthorizedException,
  UserNotConfirmedException,
} from "../erros";

export class CognitoAuthProvider extends AuthProvider implements AuthProvider {
  private awsCognito = new AwsCognito();

  constructor() {
    super();
  }

  async signUp(params: SignUpParams): Promise<SignUpResult> {
    const firstNameAttr = new CognitoUserAttribute({
      Name: "firstName",
      Value: params.firstName,
    });

    const lastNameAttr = new CognitoUserAttribute({
      Name: "lastName",
      Value: params.lastName,
    });

    const emailAttr = new CognitoUserAttribute({
      Name: "email",
      Value: params.email,
    });

    try {
      const result = await this.awsCognito.signUp({
        password: params.password,
        attributes: [emailAttr],
        username: params.username,
        validationData: [lastNameAttr, firstNameAttr],
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
      });

      return {
        userConfirmed: result?.userConfirmed ?? false,
      };
    } catch (e: any) {
      throw new AuthProviderException(e);
    }
  }

  async signIn(params: SignInParams): Promise<UserSession> {
    try {
      const cognitoUser = this.awsCognito.createCognitoUser(params.username);

      if (!cognitoUser) throw new NotAuthorizedException("User not found");

      const cognitoUserSession = await this.awsCognito.signIn(
        {
          username: params.username,
          password: params.password,
        },
        cognitoUser
      );

      const accessToken = cognitoUserSession.getAccessToken().getJwtToken();
      const idToken = cognitoUserSession.getIdToken().getJwtToken();
      const refreshToken = cognitoUserSession.getRefreshToken().getToken();

      return {
        idToken,
        refreshToken,
        accessToken,
      };
    } catch (e: any) {
      if (e.code === "UserNotConfirmedException") {
        throw new UserNotConfirmedException();
      }

      if (e.code === "NotAuthorizedException") {
        throw new NotAuthorizedException(e.message);
      }

      throw new AuthProviderException(e.message);
    }
  }

  async confirmSignUp(username: string, code: string): Promise<void> {
    try {
      await this.awsCognito.confirmSignUp(username, code);
    } catch (e: any) {
      throw new AuthProviderException(e.message);
    }
  }

  async sendConfirmationCode(username: string): Promise<void> {
    try {
      await this.awsCognito.resendConfirmationCode(username);
    } catch (e: any) {
      throw new AuthProviderException(e.message);
    }
  }

  refreshSession(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  signOut(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getCurrentUser(): User {
    throw new Error("Method not implemented.");
  }
}

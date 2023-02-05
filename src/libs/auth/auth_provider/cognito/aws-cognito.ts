import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
  CookieStorage,
} from "amazon-cognito-identity-js";

interface CognitoSingUpParams {
  username: string;
  password: string;
  attributes: CognitoUserAttribute[];
  validationData?: CognitoUserAttribute[];
  firstName: string;
  lastName: string;
  email: string;
}

interface CognitoSingInParams {
  username: string;
  password: string;
}

export class AwsCognito {
  private userPoolId = import.meta.env.VITE_USER_POOL_ID as string;
  private clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string;

  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
    });
  }

  signUp(params: CognitoSingUpParams): Promise<ISignUpResult | undefined> {
    return new Promise((resolve, reject) => {
      this.userPool.signUp(
        params.username,
        params.password,
        params.attributes,
        params.validationData || [],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  createCognitoUser(username: string): CognitoUser {
    return new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });
  }

  signIn(
    params: CognitoSingInParams,
    cognitoUser: CognitoUser
  ): Promise<CognitoUserSession> {
    const authenticationDetails = new AuthenticationDetails({
      Password: params.password,
      Username: params.username as string,
    });
    return new Promise((resolve, reject) =>
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      })
    );
  }

  confirmSignUp(username: string, code: string): Promise<void> {
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    return new Promise((resolve, reject) =>
      cognitoUser.confirmRegistration(code, true, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  }

  resendConfirmationCode(username: string): Promise<void> {
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    return new Promise((resolve, reject) =>
      cognitoUser.resendConfirmationCode((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  }

  forgotPassword(username: string): Promise<void> {
    const cognitoUser = new CognitoUser({
      Pool: this.userPool,
      Username: username,
    });

    return new Promise((resolve, reject) =>
      cognitoUser.forgotPassword({
        onSuccess: (result) => {
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      })
    );
  }

  async refreshSession(): Promise<CognitoUserSession> {
    const user = await this.getCurrentUser();

    if (!user) {
      throw new Error("Cannot refresh session since there is no user found");
    }

    const session = await this.getCurrentSession(user);
    const refreshToken = session?.getRefreshToken();

    if (!refreshToken) {
      throw new Error("Cannot refresh session since there is no refresh token");
    }

    return new Promise((resolve, reject) =>
      user.refreshSession(refreshToken, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  }

  async getCurrentUser(): Promise<CognitoUser | null> {
    const cognitoUser = this.userPool.getCurrentUser();

    if (!cognitoUser) {
      return null;
    }

    return cognitoUser;
  }

  async signOut(): Promise<void> {
    const cognitoUser = await this.getCurrentUser();

    if (!cognitoUser) {
      throw new Error("Cannot sign out since there is no user found");
    }

    cognitoUser.signOut();
  }

  async getCurrentUserAttributes(): Promise<{ [key: string]: any }> {
    const cognitoUser = await this.getCurrentUser();

    if (!cognitoUser) {
      throw new Error(
        "Cannot get current user attributes since there is no user found"
      );
    }

    //Needs to be called in order to verify whether the user is authenticated or not
    await this.getCurrentSession(cognitoUser);

    return new Promise((resolve, reject) =>
      cognitoUser.getUserAttributes(
        (err, result: CognitoUserAttribute[] | undefined) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const attributes =
              result?.reduce((p, c) => {
                return {
                  ...p,
                  [c.getName()]: c.getValue(),
                };
              }, {}) ?? {};

            resolve(attributes);
          }
        }
      )
    );
  }

  private async getCurrentSession(
    cognitoUser: CognitoUser
  ): Promise<CognitoUserSession | null> {
    if (!cognitoUser) {
      throw new Error(
        "Cannot get current session since there is no user found"
      );
    }

    return new Promise((resolve, reject) =>
      cognitoUser.getSession((err: Error, result: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    );
  }
}

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
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
}

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  ISignUpResult,
} from "amazon-cognito-identity-js";
import { SignInParams, SignUpParams } from "./interfaces";

export class AwsCognitoService {
  private userPoolId = "us-east-1_cCTLAwRsM";
  private clientId = "74m2e7re4jnq7c7aqb11niba8v";
  private userPool: CognitoUserPool;

  constructor() {
    this.userPool = new CognitoUserPool({
      ClientId: this.clientId,
      UserPoolId: this.userPoolId,
    });
  }

  signUp(params: SignUpParams): Promise<ISignUpResult | undefined> {
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
    params: SignInParams,
    cognitoUser: CognitoUser
  ): Promise<CognitoUserSession> {
    const authenticationDetails = new AuthenticationDetails({
      Password: params.password,
      Username: params.email as string,
    });
    console.log(authenticationDetails);
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
}

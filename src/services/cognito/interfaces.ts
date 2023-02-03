import { CognitoUserAttribute } from "amazon-cognito-identity-js";

export interface SignUpParams {
  username: string;
  password: string;
  attributes: CognitoUserAttribute[];
  validationData?: CognitoUserAttribute[];
}

export interface SignInParams {
  username?: string;
  email?: string;
  password: string;
}

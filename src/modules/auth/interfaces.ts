import {
  CognitoAccessToken,
  CognitoIdToken,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";

export interface UserSession {
  idToken: CognitoIdToken;
  accessToken: CognitoAccessToken;
  refreshToken: CognitoRefreshToken;
}

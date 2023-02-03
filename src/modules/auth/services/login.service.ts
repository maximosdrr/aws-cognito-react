import { CognitoUserSession } from "amazon-cognito-identity-js";
import { AwsCognitoService } from "../../../services/cognito/aws-cognito";

export class LoginService {
  constructor(private awsCognitoService: AwsCognitoService) {}

  async login(
    username: string,
    password: string
  ): Promise<CognitoUserSession | null> {
    const cognitoUser = this.awsCognitoService.createCognitoUser(username);

    if (!cognitoUser) throw new Error("User not found");

    return await this.awsCognitoService.signIn(
      {
        username,
        password,
      },
      cognitoUser
    );
  }
}

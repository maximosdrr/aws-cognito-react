import {
  CognitoUserAttribute,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import { AwsCognitoService } from "../../../services/cognito/aws-cognito";

interface RegisterParams {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}

export class RegisterService {
  constructor(private awsCognitoService: AwsCognitoService) {}

  async register(params: RegisterParams): Promise<void> {
    const cognitoService = new AwsCognitoService();

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

    cognitoService.signUp({
      password: params.password,
      attributes: [emailAttr, lastNameAttr, firstNameAttr],
      username: params.username,
    });
  }
}

import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  SignUpCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { Fetch } from "./fetch";

const CREDENTIALS = {
  ClientId: process.env.CLIENT_ID as string,
  ClientSecret: process.env.CLIENT_SECRET as string,
} as const;
const REDIRECT_URI = "http://localhost:3000/api/signin/callback";
const COGNITO_ENDPOINT = `https://${process.env.CUSTOM_DOMAIN}.auth.${process.env.REGION}.amazoncognito.com`;

class Cognito {
  private readonly client = new CognitoIdentityProviderClient({});

  async signUp(params: { email: string; password: string }) {
    const command = new SignUpCommand({
      ClientId: CREDENTIALS.ClientId,
      SecretHash: this.makeSecretHash(params.email),
      Username: params.email,
      Password: params.password,
    });
    await this.client.send(command);
  }

  async confirmSignUp(params: { email: string; confirmationCode: string }) {
    const command = new ConfirmSignUpCommand({
      ClientId: CREDENTIALS.ClientId,
      SecretHash: this.makeSecretHash(params.email),
      Username: params.email,
      ConfirmationCode: params.confirmationCode,
    });
    await this.client.send(command);
  }

  private makeSecretHash(email: string) {
    return createHmac("sha256", CREDENTIALS.ClientSecret)
      .update(email + CREDENTIALS.ClientId)
      .digest("base64");
  }

  makeAuthorizeUri(state: string) {
    const path = "/oauth2/authorize";
    const params = new URLSearchParams({
      response_type: "code",
      client_id: CREDENTIALS.ClientId,
      redirect_uri: REDIRECT_URI,
      state,
    }).toString();
    return COGNITO_ENDPOINT + path + "?" + params;
  }

  async getTokenWithAuthorizationCode(code: string) {
    const url = COGNITO_ENDPOINT + "/oauth2/token";
    const params = new URLSearchParams({
      code,
      client_id: CREDENTIALS.ClientId,
      client_secret: CREDENTIALS.ClientSecret,
      grant_type: "authorization_code",
      redirect_uri: REDIRECT_URI,
    });
    const json = await (
      await Fetch.post({
        url,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      })
    ).json();
    return {
      idToken: json.id_token,
      expireIn: json.expires_in,
    };
  }
}

export const cognitoService = new Cognito();

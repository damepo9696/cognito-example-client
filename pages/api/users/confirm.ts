import type { NextApiRequest, NextApiResponse } from "next";
import { cognitoService } from "../../../services/cognito";

export type ConfirmSignUpRequestBody = {
  email: string;
  confirmationCode: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = JSON.parse(req.body) as ConfirmSignUpRequestBody;
    await cognitoService.confirmSignUp({
      email: body.email,
      confirmationCode: body.confirmationCode,
    });
    res.status(200).json({ message: "Confirm signup succeed" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Confirm signup failed" });
  }
}

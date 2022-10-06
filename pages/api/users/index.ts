import type { NextApiRequest, NextApiResponse } from "next";
import { cognitoService } from "../../../services/cognito";

export type SignUpRequestBody = {
  email: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const body = JSON.parse(req.body) as SignUpRequestBody;
    await cognitoService.signUp({
      email: body.email,
      password: body.password,
    });
    res.status(200).json({ message: "Signup succeed" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Signup failed" });
  }
}

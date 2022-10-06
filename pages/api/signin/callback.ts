import type { NextApiRequest, NextApiResponse } from "next";
import { Path } from "../../../constants";
import { cognitoService } from "../../../services/cognito";
import { sessionsTableService } from "../../../services/sessionsTable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const authorizationCode = req.query.code as string;
    const state = req.query.state;
    const sessionId = req.cookies.session || "";
    const session = await sessionsTableService.get(sessionId);
    if (!state || session.state !== state) {
      throw new Error("Validate state failed");
    }
    const tokens = await cognitoService.getTokenWithAuthorizationCode(
      authorizationCode
    );
    await sessionsTableService.create({
      id: sessionId,
      state: "",
      idToken: tokens.idToken,
      expireIn: tokens.expireIn,
    });
    res.redirect(Path.Test);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Signin callback failed" });
  }
}

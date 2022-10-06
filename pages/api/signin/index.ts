import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "nookies";
import { v4 } from "uuid";
import { cognitoService } from "../../../services/cognito";
import { sessionsTableService } from "../../../services/sessionsTable";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionId = req.cookies.session || v4();
    const state = v4();
    await sessionsTableService.create({
      id: sessionId,
      state,
    });
    setCookie({ res }, "session", sessionId, {
      httpOnly: true,
    });
    const uri = cognitoService.makeAuthorizeUri(state);
    res.status(200).json({ message: "Signin succeed", authorize_uri: uri });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Signin failed" });
  }
}

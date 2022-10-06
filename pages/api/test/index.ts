import type { NextApiRequest, NextApiResponse } from "next";
import { Fetch } from "../../../services/fetch";
import { sessionsTableService } from "../../../services/sessionsTable";

const TEST_API_ENDPOINT = process.env.API_ENDPOINT;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const sessionId = req.cookies.session || "";
    const idToken = (await sessionsTableService.get(sessionId)).idToken;
    const response = await (
      await Fetch.get({
        url: TEST_API_ENDPOINT + "/test",
        headers: { Authorization: "Bearer " + idToken },
      })
    ).json();
    console.log(`Api response ${JSON.stringify(response)}`);
    res.status(200).json({ message: "Api call succeed" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Api call failed" });
  }
}

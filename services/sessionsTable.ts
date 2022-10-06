import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { v4 } from "uuid";

export type Session = Partial<{
  id: string;
  state: string;
  idToken: string;
  expireIn: number;
}>;

const TABLE_NAME = process.env.SESSIONS_TABLE_NAME || "";
const PK = "id";

class SessionsTable {
  private readonly client = new DynamoDBClient({});

  async get(id: string) {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        [PK]: id,
      },
    });
    const item = (await this.client.send(command)).Item;
    const session: Session = {
      id: item?.id,
      state: item?.state,
      idToken: item?.idToken,
      expireIn: item?.expireIn,
    };
    return session;
  }

  async create(params: Session) {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        [PK]: v4(),
        ...params,
      },
    });
    await this.client.send(command);
  }

  async update(params: Session) {
    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        [PK]: params.id,
      },
      ExpressionAttributeNames: {
        "#state": "state",
        "#idToken": "idToken",
        ":expireIn": "expireIn",
      },
      ExpressionAttributeValues: {
        ":state": params.state || "",
        ":idToken": params.idToken || "",
        ":expireIn": params.expireIn || 0,
      },
      UpdateExpression:
        "set #state = :state, #idToken = :idToken, #expireIn = :expireIn",
    });
    await this.client.send(command);
  }
}

export const sessionsTableService = new SessionsTable();

type FetchParams = {
  url: string;
  headers?: HeadersInit;
};
type PostParams = FetchParams & {
  body: any;
};

export class Fetch {
  public static async get(params: FetchParams) {
    const response = await fetch(params.url, {
      headers: params.headers,
    });
    await this.handleResponse(response);
    return response;
  }

  public static async post(params: PostParams) {
    const response = await fetch(params.url, {
      method: "POST",
      headers: params.headers,
      body: params.body,
    });
    await this.handleResponse(response);
    return response;
  }

  private static async handleResponse(response: Response) {
    if (response.status < 400) {
      return;
    }
    const message = await response.text();
    console.error(`status ${response.status}, message ${message}`);
    throw new Error("Fetch failed");
  }
}

export type FetchMethod = "GET" | "POST" | "PATCH";

export interface FetchOptions {
  body?: object;
  accessToken?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export async function fetchData<T>(
  url: string,
  method: FetchMethod,
  options?: FetchOptions
): Promise<Partial<T & ErrorResponse>> {
  const requestInit: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (options) {
    if (options.body) {
      requestInit.body = JSON.stringify(options.body);
    }
    if (options.accessToken) {
      requestInit.headers = {
        ...requestInit.headers,
        ...{ Authorization: `Bearer ${options.accessToken}` },
      };
    }
  }

  try {
    const response = await fetch(url, requestInit);

    const res = (await response.json()) as T & ErrorResponse;

    if (!response.ok) {
      res.error = res.error ?? "Unknown Error";
      res.message = res.message ?? "Unknown erorr is found.";
    }

    return res;
  } catch (error) {
    const errorResponse = {
      error: "Connection Error",
      message: "Could not connect the server.",
    } as Partial<T & ErrorResponse>;
    return errorResponse;
  }
}

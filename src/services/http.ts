import { Config } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

async function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = undefined
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${Config.apiUrl}${url}`, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export const http = {
  get: <T>(url: string) => request<T>(url, "GET"),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  put: <T>(url: string, data: any) => request<T>(url, "PUT", data),
  delete: <T>(url: string) => request<T>(url, "DELETE"),
};

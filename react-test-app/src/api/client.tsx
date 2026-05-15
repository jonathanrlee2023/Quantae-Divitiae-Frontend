import { getAccessToken, setAccessToken } from "../auth/token";

const DEFAULT_BASE_URL = "http://localhost:8080";
const DEFAULT_WS_URL = "ws://localhost:8080";

export function apiWsUrl() {
  const fromEnv = (import.meta as any).env?.VITE_API_WS_URL as
    | string
    | undefined;
  return fromEnv?.trim() ? fromEnv.trim() : DEFAULT_WS_URL;
}

export function apiBaseUrl() {
  const fromEnv = (import.meta as any).env?.VITE_API_BASE_URL as
    | string
    | undefined;
  return fromEnv?.trim() ? fromEnv.trim() : DEFAULT_BASE_URL;
}

export function apiUrl(path: string) {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${apiBaseUrl()}${path}`;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const token = getAccessToken();

  const headers = new Headers(init.headers ?? undefined);
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: init.credentials ?? "include",
  });
}

export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(apiUrl("/refresh"), {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();
  if (typeof data?.access_token !== "string" || !data.access_token) {
    throw new Error("Invalid refresh response");
  }

  setAccessToken(data.access_token);
  return data.access_token;
}

export async function logoutSession(): Promise<void> {
  await fetch(apiUrl("/logout"), {
    method: "POST",
    credentials: "include",
  });
}

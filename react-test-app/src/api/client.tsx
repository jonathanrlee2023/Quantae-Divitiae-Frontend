import { getAccessToken } from "../auth/token";

const DEFAULT_BASE_URL = "http://localhost:8080";

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

  return fetch(apiUrl(path), { ...init, headers });
}

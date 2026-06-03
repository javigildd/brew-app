"use client";

// The user's own Anthropic API key (BYOK). Stored ONLY in this browser's
// localStorage — never sent to the database, never committed.
const API_KEY_STORE = "brew_anthropic_key";

export function getApiKey(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(API_KEY_STORE);
}

export function setApiKey(value: string): void {
  localStorage.setItem(API_KEY_STORE, value.trim());
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORE);
}

// Headers to attach to /api/extract so the server uses the user's own key.
export function apiKeyHeaders(): Record<string, string> {
  const key = getApiKey();
  return key ? { "x-anthropic-key": key } : {};
}

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchApi } from "../api/client";

const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
// AIML_API_KEY is now server-side only (no VITE_ prefix, not in the browser bundle)
export const AIMLAPI_BASE_URL = "https://api.aimlapi.com/v1";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  isDevMode: boolean;
  devApiKey: string;
  devBaseUrl: string;
  login: (u: string, p: string) => Promise<boolean>;
  logout: () => void;
  setDevApiConfig: (apiKey: string, baseUrl: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      token: null,
      isDevMode: false,
      devApiKey: "",
      devBaseUrl: DEFAULT_NVIDIA_BASE_URL,
      login: async (u: string, p: string) => {
        const cleanUser = u.trim();
        const cleanPass = p.trim();

        if (!cleanUser || !cleanPass) return false;

        // Check for special hidden developer user "baanbhaba"
        if (cleanUser.toLowerCase() === "baanbhaba" && cleanPass === "baanbhaba") {
          set({
            isAuthenticated: true,
            username: "baanbhaba",
            isDevMode: true,
            devApiKey: "",
            devBaseUrl: DEFAULT_NVIDIA_BASE_URL,
            token: "baanbhaba-dev-session-active",
          });
          return true;
        }

        // Check for hardcoded consumer "admin"
        if (cleanUser === "admin" && cleanPass === "admin") {
          set({
            isAuthenticated: true,
            username: "admin",
            isDevMode: false,
            token: "admin-session-token",
          });
          return true;
        }

        try {
          // Send request to Rust backend database authentication service
          const res = await fetchApi<{ success: boolean; username: string; token?: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username: cleanUser, password: cleanPass }),
          });

          if (res && res.success) {
            set({
              isAuthenticated: true,
              username: res.username || cleanUser,
              isDevMode: false,
              token: res.token || "session-token-active",
            });
            return true;
          }
          return false;
        } catch (err) {
          console.error("Authentication failed:", err);
          return false;
        }
      },
      logout: () =>
        set({
          isAuthenticated: false,
          username: null,
          token: null,
          isDevMode: false,
          devApiKey: "",
          devBaseUrl: DEFAULT_NVIDIA_BASE_URL,
        }),
      setDevApiConfig: (apiKey, baseUrl) =>
        set({
          devApiKey: apiKey,
          devBaseUrl: baseUrl || DEFAULT_NVIDIA_BASE_URL,
        }),
    }),
    {
      name: "ema-auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

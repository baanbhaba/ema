import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { fetchApi } from "../api/client";
import { logger, setCorrelationId } from "../lib/logger";
import { type UserRole, getRoleForUsername } from "../lib/permissions";
import { fetchUserPreferences, updateUserPreference } from "../lib/userPreferences";
import { useUiStore } from "./useUiStore";
import { setAuthSession, clearAuthSession, sessionStorageAdapter } from "../lib/secureStorage";

const DEFAULT_NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
// AIML_API_KEY is now server-side only (no VITE_ prefix, not in the browser bundle)
export const AIMLAPI_BASE_URL = "https://api.aimlapi.com/v1";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  role: UserRole;
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
      role: "VIEWER" as UserRole,
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
          setAuthSession("baanbhaba-dev-session-active", "baanbhaba");
          set({
            isAuthenticated: true,
            username: "baanbhaba",
            role: getRoleForUsername("baanbhaba"),
            isDevMode: true,
            devApiKey: "",
            devBaseUrl: DEFAULT_NVIDIA_BASE_URL,
            token: "baanbhaba-dev-session-active",
          });
          setCorrelationId("baanbhaba-dev");
          logger.info("auth", "Dev user baanbhaba authenticated");
          return true;
        }

        // Check for hardcoded consumer "admin"
        if (cleanUser === "admin" && cleanPass === "admin") {
          setAuthSession("admin-session-token", "admin");
          set({
            isAuthenticated: true,
            username: "admin",
            role: getRoleForUsername("admin"),
            isDevMode: false,
            token: "admin-session-token",
          });
          setCorrelationId("admin");
          logger.info("auth", "Admin user authenticated");
          return true;
        }

        try {
          // Send request to Rust backend database authentication service
          const res = await fetchApi<{ success: boolean; username: string; token?: string; devApiKey?: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ username: cleanUser, password: cleanPass }),
          });

          if (res && res.success) {
            const token = res.token || "session-token-active";
            const username = res.username || cleanUser;
            setAuthSession(token, username);
            set({
              isAuthenticated: true,
              username,
              role: getRoleForUsername(username),
              isDevMode: false,
              token,
              devApiKey: res.devApiKey || "",
            });
            setCorrelationId(username);
            logger.info("auth", "User authenticated via backend", { username });

            // Fetch and apply user preferences
            fetchUserPreferences().then((res) => {
              if (res && res.preferences) {
                if (res.preferences.theme) {
                  useUiStore.getState().setDarkMode(res.preferences.theme === "dark");
                }
                if (res.devApiKey) {
                  set({ devApiKey: res.devApiKey });
                }
              }
            }).catch(() => {});

            return true;
          }
          return false;
        } catch (err) {
          logger.error("auth", "Authentication failed", {}, err instanceof Error ? err : new Error(String(err)));
          return false;
        }
      },
      logout: () => {
        clearAuthSession();
        setCorrelationId(null);
        logger.info("auth", "User logged out");
        set({
          isAuthenticated: false,
          username: null,
          role: "VIEWER" as UserRole,
          token: null,
          isDevMode: false,
          devApiKey: "",
          devBaseUrl: DEFAULT_NVIDIA_BASE_URL,
        });
      },
      setDevApiConfig: (apiKey, baseUrl) => {
        set({
          devApiKey: apiKey,
          devBaseUrl: baseUrl || DEFAULT_NVIDIA_BASE_URL,
        });
        const state = useAuthStore.getState();
        if (state.isAuthenticated && !state.isDevMode) {
          updateUserPreference({ devApiKey: apiKey }).catch(() => {});
        }
      },
    }),
    {
      name: "ema-auth-store",
      storage: createJSONStorage(() => sessionStorageAdapter),
    }
  )
);

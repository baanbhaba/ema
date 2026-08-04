import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
  login: (u: string, p: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      login: (u, p) => {
        if (u.trim().toLowerCase() === "admin" && p.trim() === "admin") {
          set({ isAuthenticated: true, username: "admin" });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, username: null }),
    }),
    {
      name: "ema-auth-store",
    }
  )
);

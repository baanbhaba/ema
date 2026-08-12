import { fetchApi } from "../api/client";

export interface UserPreferences {
  theme: "dark" | "light";
  aiModel: string;
  defaultReviewMode: string;
  notificationsEnabled: boolean;
  devApiKey?: string;
}

export async function fetchUserPreferences(): Promise<{ preferences: UserPreferences, devApiKey?: string } | null> {
  try {
    const res = await fetchApi<{ success: boolean; preferences: UserPreferences, devApiKey?: string }>("/user/preferences", {
      method: "GET",
    });
    if (res && res.success) {
      return { preferences: res.preferences, devApiKey: res.devApiKey };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch user preferences:", error);
    return null;
  }
}

export async function updateUserPreference(updates: Partial<UserPreferences>): Promise<void> {
  try {
    await fetchApi<{ success: boolean; preferences: UserPreferences }>("/user/preferences", {
      method: "PATCH",
      body: JSON.stringify(updates),
    });
  } catch (error) {
    console.error("Failed to update user preference:", error);
  }
}

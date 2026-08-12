import { z } from "zod";

const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url().default("http://localhost:8080/api/v1"),
  VITE_USE_MOCKS: z.enum(["true", "false"]).default("false"),
  // Note: Add other variables here as needed in the future
});

export const env = envSchema.parse({
  VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  VITE_USE_MOCKS: import.meta.env.VITE_USE_MOCKS,
});

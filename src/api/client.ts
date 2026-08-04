let simulateErrorsGlobal = false;

export const setSimulateApiError = (enable: boolean) => {
  simulateErrorsGlobal = enable;
};

export const getSimulateApiError = () => simulateErrorsGlobal;

export const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || "/api/v1";

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (simulateErrorsGlobal) {
    throw new Error("Simulated Backend API Error: 503 Service Unavailable");
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Backend Request Failed (${response.status}): ${errorText || response.statusText}`
    );
  }

  return response.json();
}

export * from "./project";
export * from "./review";
export * from "./transform";
export * from "./report";


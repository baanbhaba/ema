import { create } from "zustand";

interface UiState {
  // Theme & Drawers
  isDarkMode: boolean;
  isHamburgerOpen: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  toggleHamburger: () => void;
  setHamburgerOpen: (isOpen: boolean) => void;

  // Blueprint Inspection tracking per project
  viewedSteps: Record<string, string[]>;
  expandedSteps: string[];
  markStepViewed: (projectId: string, stepId: string) => void;
  markAllStepsViewed: (projectId: string, stepIds: string[]) => void;
  toggleStepExpanded: (stepId: string) => void;
  expandAllSteps: (stepIds: string[]) => void;
  collapseAllSteps: () => void;

  // Simulation Toggles
  isSimulatingApiError: boolean;
  toggleSimulateApiError: () => void;

  // API & LLM Settings
  nvidiaApiKey: string;
  nvidiaBaseUrl: string;
  selectedAnalysisModel: string;
  selectedTransformationModel: string;
  setNvidiaApiKey: (value: string) => void;
  setApiKey: (keyName: string, value: string) => void;
  setNvidiaBaseUrl: (baseUrl: string) => void;
  setSelectedModel: (type: "analysis" | "transformation", model: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  isDarkMode: true,
  isHamburgerOpen: false,
  toggleDarkMode: () =>
    set((state) => {
      const next = !state.isDarkMode;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return { isDarkMode: next };
    }),
  setDarkMode: (isDark) => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ isDarkMode: isDark });
  },

  toggleHamburger: () => set((state) => ({ isHamburgerOpen: !state.isHamburgerOpen })),
  setHamburgerOpen: (isOpen) => set({ isHamburgerOpen: isOpen }),

  viewedSteps: {},
  expandedSteps: [],

  markStepViewed: (projectId, stepId) =>
    set((state) => {
      const current = state.viewedSteps[projectId] || [];
      if (current.includes(stepId)) return state;
      return {
        viewedSteps: {
          ...state.viewedSteps,
          [projectId]: [...current, stepId],
        },
      };
    }),

  markAllStepsViewed: (projectId, stepIds) =>
    set((state) => ({
      viewedSteps: {
        ...state.viewedSteps,
        [projectId]: stepIds,
      },
    })),

  toggleStepExpanded: (stepId) =>
    set((state) => {
      const exists = state.expandedSteps.includes(stepId);
      return {
        expandedSteps: exists
          ? state.expandedSteps.filter((id) => id !== stepId)
          : [...state.expandedSteps, stepId],
      };
    }),

  expandAllSteps: (stepIds) => set({ expandedSteps: stepIds }),
  collapseAllSteps: () => set({ expandedSteps: [] }),

  isSimulatingApiError: false,
  toggleSimulateApiError: () =>
    set((state) => ({ isSimulatingApiError: !state.isSimulatingApiError })),

  nvidiaApiKey: "[REDACTED]",
  nvidiaBaseUrl: "https://integrate.api.nvidia.com/v1",
  selectedAnalysisModel: "meta/llama-3.3-70b-instruct",
  selectedTransformationModel: "meta/llama-3.3-70b-instruct",

  setNvidiaApiKey: (value) => set({ nvidiaApiKey: value }),
  setApiKey: (_keyName, value) => set({ nvidiaApiKey: value }),

  setNvidiaBaseUrl: (baseUrl) =>
    set({ nvidiaBaseUrl: baseUrl }),

  setSelectedModel: (type, model) =>
    set((state) => ({
      ...state,
      [type === "analysis" ? "selectedAnalysisModel" : "selectedTransformationModel"]: model,
    })),
}));

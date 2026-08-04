import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BlueprintPage } from "../pages/BlueprintPage";
import { useUiStore } from "../store/useUiStore";

// Mock API calls to run synchronously without delay in tests
vi.mock("../api/client", async () => {
  const actual = await vi.importActual("../api/client");
  return {
    ...actual,
    getBlueprint: vi.fn().mockResolvedValue({
      project_id: "proj-payment-gateway",
      steps: [
        {
          id: "step-1",
          file_or_module: "pom.xml",
          what_changes: "Upgrade Java target version to 21",
          why: "Baseline migration step",
          target_pattern: "<java.version>21</java.version>",
          risk_level: "high",
          depends_on: [],
          status: "pending",
        },
        {
          id: "step-2",
          file_or_module: "src/main/java/com/acme/payment/model/AuditLog.java",
          what_changes: "Replace javax with jakarta",
          why: "Jakarta EE 10",
          target_pattern: "import jakarta.persistence.*;",
          risk_level: "low",
          depends_on: ["step-1"],
          status: "pending",
        },
      ],
    }),
    approveBlueprintStep: vi.fn().mockResolvedValue({
      id: "step-1",
      status: "approved",
    }),
    rejectBlueprintStep: vi.fn().mockImplementation((_projId, stepId, reason) => {
      if (!reason || reason.trim().length === 0) {
        return Promise.reject(new Error("Rejection reason is required"));
      }
      return Promise.resolve({
        id: stepId,
        status: "rejected",
        rejection_reason: reason,
      });
    }),
    updateBlueprintStep: vi.fn(),
    approveAllBlueprintSteps: vi.fn().mockResolvedValue({}),
  };
});

const renderBlueprintPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/projects/proj-payment-gateway/blueprint"]}>
        <Routes>
          <Route path="/projects/:id/blueprint" element={<BlueprintPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("BlueprintPage Component Tests", () => {
  beforeEach(() => {
    useUiStore.setState({
      viewedSteps: {},
      expandedSteps: [],
      isSimulatingApiError: false,
    });
  });

  it("1. Renders blueprint steps correctly", async () => {
    renderBlueprintPage();

    expect(await screen.findByText("Transformation Steps")).toBeInTheDocument();
    expect(screen.getByText("pom.xml")).toBeInTheDocument();
    expect(screen.getByText("src/main/java/com/acme/payment/model/AuditLog.java")).toBeInTheDocument();
  });

  it("2. Approving a step triggers step approval", async () => {
    const { approveBlueprintStep } = await import("../api/client");
    renderBlueprintPage();

    const approveBtn = await screen.findByTestId("approve-btn-step-1");
    fireEvent.click(approveBtn);

    await waitFor(() => {
      expect(approveBlueprintStep).toHaveBeenCalledWith("proj-payment-gateway", "step-1");
    });
  });

  it("3. Rejecting a step without a reason is blocked", async () => {
    renderBlueprintPage();

    const rejectBtn = await screen.findByTestId("reject-btn-step-1");
    fireEvent.click(rejectBtn);

    expect(await screen.findByText("Reject Blueprint Step: step-1")).toBeInTheDocument();

    const confirmRejectBtn = screen.getByText("Confirm Rejection");
    // Button is disabled when textarea is empty
    expect(confirmRejectBtn).toBeDisabled();
  });

  it("4. Rejecting a step with a valid reason succeeds", async () => {
    const { rejectBlueprintStep } = await import("../api/client");
    renderBlueprintPage();

    const rejectBtn = await screen.findByTestId("reject-btn-step-1");
    fireEvent.click(rejectBtn);

    const textarea = await screen.findByPlaceholderText(/Explain why this transformation is rejected/i);
    await userEvent.type(textarea, "Security constraint on reflection");

    const confirmRejectBtn = screen.getByText("Confirm Rejection");
    expect(confirmRejectBtn).not.toBeDisabled();
    fireEvent.click(confirmRejectBtn);

    await waitFor(() => {
      expect(rejectBlueprintStep).toHaveBeenCalledWith(
        "proj-payment-gateway",
        "step-1",
        "Security constraint on reflection"
      );
    });
  });

  it("5. Bulk-approve ('Approve All') is disabled until all steps are reviewed", async () => {
    renderBlueprintPage();

    const bulkApproveBtn = await screen.findByTestId("approve-all-btn");
    // Initially unreviewed steps exist, so bulk approve is disabled
    expect(bulkApproveBtn).toBeDisabled();

    // Click 'Mark All Reviewed' button to mark all steps viewed in Zustand store
    const markAllBtn = screen.getByTestId("mark-all-viewed-btn");
    fireEvent.click(markAllBtn);

    await waitFor(() => {
      expect(bulkApproveBtn).not.toBeDisabled();
    });
  });
});

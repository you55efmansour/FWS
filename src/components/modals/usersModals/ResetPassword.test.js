import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResetPassModal from "./ResetPassModal";
import userStore from "../../../stores/userStore";



// Mock AuthStore
jest.mock("../../../stores/AuthStore", () => {
  const mockAuthStore = {
    token: "mock-token",
  };
  return {
    __esModule: true,
    default: mockAuthStore,
  };
});

// Mock UserStore
jest.mock("../../../stores/userStore", () => {
  const mockUserStore = {
    resetPassword: jest.fn().mockResolvedValue([]),
  };
  return {
    __esModule: true,
    default: mockUserStore,
  };
});


jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => <span>Mocked Icon</span>,
}));


describe("test ResetpassModal", () => {
    const authStore = require("../../../stores/AuthStore").default;
    const mockClose = jest.fn();
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test("renders modal with all inputs", async () => {
    render(<ResetPassModal close={jest.fn()} />);

    expect(screen.getByLabelText(/Admin Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/id/i)).toBeInTheDocument();
  });

  test("submits the form with input values", async () => {
    render(<ResetPassModal close={mockClose} />);

    const adminPasswordInput = screen.getByLabelText(/Admin Password/i);
    const newPasswordInput = screen.getByLabelText(/new Password/i);
    const userIdInput = screen.getByLabelText(/id/i);
    const submitButton = screen.getByRole("button", { name: /Change/i });

    fireEvent.change(adminPasswordInput, { target: { value: "admin123" } });
    fireEvent.change(newPasswordInput, { target: { value: "newpass456" } });
    fireEvent.change(userIdInput, { target: { value: "5" } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(userStore.resetPassword).toHaveBeenCalledWith(
        {
          adminPassword: "admin123",
          newPassword: "newpass456",
          userId: 5,
        },
        authStore.token
      );
    });
  });

});
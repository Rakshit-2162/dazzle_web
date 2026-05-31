import { create } from "zustand";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
  hideSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  open: false,
  message: "",
  severity: "success",
  showSnackbar: (message, severity = "success") =>
    set({ open: true, message, severity }),
  hideSnackbar: () => set({ open: false }),
}));

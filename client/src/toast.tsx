import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert } from "@mui/material";

type Toast = {
  message: string;
  severity?: "info" | "success" | "warning" | "error";
} | null;

const ToastContext = createContext<(t: Toast) => void>(() => {});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<Toast>(null);

  const show = (t: Toast) => setToast(t);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {toast ? (
          <Alert
            onClose={() => setToast(null)}
            severity={toast.severity || "info"}
            sx={{ width: "100%" }}
          >
            {toast.message}
          </Alert>
        ) : null}
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastProvider;

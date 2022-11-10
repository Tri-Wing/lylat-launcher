import React from "react";
import type { Id, ToastOptions, UpdateOptions } from "react-toastify";
import { toast } from "react-toastify";

export const useToasts = () => {
  const toastHandlers = React.useMemo(
    () => ({
      showError: (error: Error | string | unknown) => {
        let message: string;
        if (error instanceof Error) {
          message = error.message;
        } else if (typeof error === "string") {
          message = error;
        } else {
          message = JSON.stringify(error);
        }
        // Let's not automatically hide error messages
        toast.error(message, {
          autoClose: false,
          hideProgressBar: true,
          position: "bottom-right",
          theme: "dark",
        });
      },
      showSuccess: (message: string) => {
        return toast.success(message, {
          position: "bottom-right",
          theme: "dark",
        });
      },
      showWarning: (message: string) => {
        return toast.warning(message, {
          position: "bottom-right",
          theme: "dark",
        });
      },
      showInfo: (message: string) =>
        toast.info(message, {
          position: "bottom-right",
          theme: "dark",
        }),
      showCustomToast: (message: string, options?: ToastOptions) => {
        if (options) {
          return toast.info(message, options);
        }
        return toast.info(message, {
          position: "bottom-right",
          theme: "dark",
        });
      },
      dismissToast: (id: Id) => toast.dismiss(id),
      updateToast: (id: Id, options: UpdateOptions) => toast.update(id, options),
    }),
    [],
  );
  return toastHandlers;
};

import type { ModService } from "mods/types";
import { useCallback } from "react";

import { useIsoPathsExtra } from "@/lib/hooks/useSettings";
import { useToasts } from "@/lib/hooks/useToasts";

export const useModActions = (modService: ModService) => {
  const { showCustomToast, showError, showSuccess, dismissToast } = useToasts();
  const [, addIsoPathExtra] = useIsoPathsExtra();

  const downloadISOPatch = useCallback(
    async (url: string, isoPath: string, destinationPath: string) => {
      const downloadToastId = showCustomToast("Downloading and installing ISO patch...", {
        autoClose: false,
        hideProgressBar: true,
        position: "bottom-right",
        theme: "dark",
      });
      try {
        await modService.downloadISOPatch(url, isoPath, destinationPath);
        dismissToast(downloadToastId);
        await addIsoPathExtra(destinationPath);
        showSuccess("Installation complete");
      } catch (err) {
        dismissToast(downloadToastId);
        showError("Download failed");
      }
    },
    [showCustomToast, modService, addIsoPathExtra, showSuccess, dismissToast, showError],
  );

  return {
    downloadISOPatch,
  };
};

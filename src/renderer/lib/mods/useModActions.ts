import type { ModService } from "mods/types";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

import { useToasts } from "@/lib/hooks/useToasts";

export const useModActions = (modService: ModService) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { showError, showSuccess } = useToasts();

  const downloadISOPatch = useCallback(
    async (url: string, isoPath: string) => {
      enqueueSnackbar("Downloading and installing ISO patch...", {
        persist: true,
        key: "downloading",
      });
      try {
        await modService.downloadISOPatch(url, isoPath);
        closeSnackbar("downloading");
        showSuccess("Installation complete");
      } catch (err) {
        closeSnackbar("downloading");
        showError("Download failed");
      }
    },
    [enqueueSnackbar, modService, closeSnackbar, showSuccess, showError],
  );

  return {
    downloadISOPatch,
  };
};

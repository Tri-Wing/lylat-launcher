import type { ModService } from "mods/types";
import { useSnackbar } from "notistack";
import { useCallback } from "react";

import { useIsoPathsExtra } from "@/lib/hooks/useSettings";
import { useToasts } from "@/lib/hooks/useToasts";

export const useModActions = (modService: ModService) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { showError, showSuccess } = useToasts();
  const [, addIsoPathExtra] = useIsoPathsExtra();

  const downloadISOPatch = useCallback(
    async (url: string, isoPath: string, destinationPath: string) => {
      enqueueSnackbar("Downloading and installing ISO patch...", {
        persist: true,
        key: "downloading",
      });
      try {
        await modService.downloadISOPatch(url, isoPath, destinationPath);
        closeSnackbar("downloading");
        await addIsoPathExtra(destinationPath);
        showSuccess("Installation complete");
      } catch (err) {
        closeSnackbar("downloading");
        showError("Download failed");
      }
    },
    [enqueueSnackbar, modService, closeSnackbar, addIsoPathExtra, showSuccess, showError],
  );

  return {
    downloadISOPatch,
  };
};

import type { ModService } from "mods/types";
import { useCallback } from "react";

import { useToasts } from "@/lib/hooks/useToasts";

export const useModActions = (modService: ModService) => {
  const { showError } = useToasts();

  const downloadISOPatch = useCallback(
    async (url: string, isoPath: string) => {
      try {
        await modService.downloadISOPatch(url, isoPath);
      } catch (err) {
        showError(err);
      }
    },
    [modService, showError],
  );

  return {
    downloadISOPatch,
  };
};

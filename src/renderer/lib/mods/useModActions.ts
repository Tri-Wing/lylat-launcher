import type { ModService } from "mods/types";

import { useIsoPathsExtra } from "@/lib/hooks/useSettings";

export const useModActions = (modService: ModService) => {
  const [, addIsoPathExtra] = useIsoPathsExtra();

  const downloadISOPatch = async (url: string, fileName: string) => {
    try {
      await modService.downloadISOPatch(url, fileName);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return false;
    }
  };

  const installISOPatch = async (isoPath: string, destinationPath: string, fileName: string) => {
    try {
      await modService.installISOPatch(isoPath, destinationPath, fileName);
      await addIsoPathExtra(destinationPath);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      return false;
    }
  };

  return {
    downloadISOPatch,
    installISOPatch,
  };
};

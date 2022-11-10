import { ipc_downloadISOPatch, ipc_installISOPatch } from "./ipc";
import type { ModManager } from "./manager";

export default function setupModIpc({ modManager }: { modManager: ModManager }) {
  ipc_downloadISOPatch.main!.handle(async ({ downloadUrl: downloadUrl, fileName: fileName }) => {
    await modManager.downloadModFile(downloadUrl, fileName);
    return { success: true };
  });

  ipc_installISOPatch.main!.handle(
    async ({ isoPath: isoPath, destinationPath: destinationPath, fileName: fileName }) => {
      await modManager.installISOpatch(isoPath, destinationPath, fileName);
      return { success: true };
    },
  );

  return { modManager };
}

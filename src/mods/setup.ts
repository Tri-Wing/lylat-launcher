import { ipc_downloadISOPatch } from "./ipc";
import type { ModManager } from "./manager";

export default function setupModIpc({ modManager }: { modManager: ModManager }) {
  ipc_downloadISOPatch.main!.handle(async ({ downloadUrl: downloadUrl, isoPath: isoPath }) => {
    await modManager.downloadModFile(downloadUrl, "patch.xdelta");
    await modManager.installISOpatch(isoPath);
    return { success: true };
  });

  return { modManager };
}

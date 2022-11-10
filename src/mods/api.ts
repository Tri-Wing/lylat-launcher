/* eslint-disable import/no-default-export */

import { ipc_downloadISOPatch, ipc_installISOPatch } from "./ipc";
import type { ModService } from "./types";

const modApi: ModService = {
  async downloadISOPatch(url: string, fileName: string) {
    await ipc_downloadISOPatch.renderer!.trigger({
      downloadUrl: url,
      fileName: fileName,
    });
  },
  async installISOPatch(isoPath: string, destinationPath: string, fileName: string) {
    await ipc_installISOPatch.renderer!.trigger({
      isoPath: isoPath,
      destinationPath: destinationPath,
      fileName: fileName,
    });
  },
};

export default modApi;

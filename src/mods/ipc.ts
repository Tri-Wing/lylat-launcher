import type { SuccessPayload } from "utils/ipc";
import { _, makeEndpoint } from "utils/ipc";

// Handlers

export const ipc_downloadISOPatch = makeEndpoint.main(
  "downloadISOPatch",
  <{ downloadUrl: string; fileName: string }>_,
  <SuccessPayload>_,
);

export const ipc_installISOPatch = makeEndpoint.main(
  "installISOPatch",
  <{ isoPath: string; destinationPath: string; fileName: string }>_,
  <SuccessPayload>_,
);

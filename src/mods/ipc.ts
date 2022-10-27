import type { SuccessPayload } from "utils/ipc";
import { _, makeEndpoint } from "utils/ipc";

// Handlers

export const ipc_downloadISOPatch = makeEndpoint.main(
  "downloadISOPatch",
  <{ downloadUrl: string; isoPath: string }>_,
  <SuccessPayload>_,
);

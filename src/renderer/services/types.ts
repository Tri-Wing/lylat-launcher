import type { BroadcastService } from "@broadcast/types";
import type { ConsoleService } from "@console/types";
import type { DolphinService } from "@dolphin/types";
import type { ModService } from "mods/types";

import type { AuthService } from "./auth/types";
import type { SlippiBackendService } from "./slippi/types";

export type Services = {
  authService: AuthService;
  slippiBackendService: SlippiBackendService;
  dolphinService: DolphinService;
  broadcastService: BroadcastService;
  consoleService: ConsoleService;
  modService: ModService;
};

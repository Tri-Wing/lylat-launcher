/* eslint-disable import/no-default-export */
import { ipcRenderer } from "electron";

import {
  ipc_addNewConnection,
  ipc_deleteConnection,
  ipc_editConnection,
  ipc_modifyIsoPathsExtra,
  ipc_openSettingsModalEvent,
  ipc_setAutoUpdateLauncher,
  ipc_setExtraSlpPaths,
  ipc_setIsoPathActive,
  ipc_setIsoPathVanilla,
  ipc_setLaunchMeleeOnPlay,
  ipc_setNetplayDolphinPath,
  ipc_setPlaybackDolphinPath,
  ipc_setRootSlpPath,
  ipc_setSpectateSlpPath,
  ipc_settingsUpdatedEvent,
  ipc_setUseMonthlySubfolders,
} from "./ipc";
import type { AppSettings, StoredConnection } from "./types";

export default {
  getAppSettingsSync() {
    return ipcRenderer.sendSync("getAppSettingsSync") as AppSettings;
  },
  onSettingsUpdated(handle: (settings: AppSettings) => void) {
    const { destroy } = ipc_settingsUpdatedEvent.renderer!.handle(async (settings) => {
      handle(settings);
    });
    return destroy;
  },
  onOpenSettingsPageRequest(handle: () => void) {
    const { destroy } = ipc_openSettingsModalEvent.renderer!.handle(async () => {
      handle();
    });
    return destroy;
  },
  async setIsoPathVanilla(isoPathVanilla: string | null): Promise<void> {
    await ipc_setIsoPathVanilla.renderer!.trigger({ isoPathVanilla: isoPathVanilla });
  },
  async setIsoPathActive(isoPathActive: string | null): Promise<void> {
    await ipc_setIsoPathActive.renderer!.trigger({ isoPathActive: isoPathActive });
  },
  async addIsoPathExtra(isoPath: string): Promise<void> {
    await ipc_modifyIsoPathsExtra.renderer!.trigger({ isoPath: isoPath });
  },
  async removeIsoPathExtra(isoPath: string): Promise<void> {
    await ipc_modifyIsoPathsExtra.renderer!.trigger({ isoPath: isoPath, remove: true });
  },
  async setRootSlpPath(rootSlpPath: string): Promise<void> {
    await ipc_setRootSlpPath.renderer!.trigger({ path: rootSlpPath });
  },
  async setUseMonthlySubfolders(toggle: boolean): Promise<void> {
    await ipc_setUseMonthlySubfolders.renderer!.trigger({ toggle });
  },
  async setSpectateSlpPath(spectateSlpPath: string): Promise<void> {
    await ipc_setSpectateSlpPath.renderer!.trigger({ path: spectateSlpPath });
  },
  async setExtraSlpPaths(paths: string[]): Promise<void> {
    await ipc_setExtraSlpPaths.renderer!.trigger({ paths });
  },
  async setNetplayDolphinPath(netplayDolphinPath: string): Promise<void> {
    await ipc_setNetplayDolphinPath.renderer!.trigger({ path: netplayDolphinPath });
  },
  async setPlaybackDolphinPath(playbackDolphinPath: string): Promise<void> {
    await ipc_setPlaybackDolphinPath.renderer!.trigger({ path: playbackDolphinPath });
  },
  async setLaunchMeleeOnPlay(launchMelee: boolean): Promise<void> {
    await ipc_setLaunchMeleeOnPlay.renderer!.trigger({ launchMelee });
  },
  async setAutoUpdateLauncher(autoUpdateLauncher: boolean): Promise<void> {
    await ipc_setAutoUpdateLauncher.renderer!.trigger({ autoUpdateLauncher });
  },
  async addNewConnection(connection: Omit<StoredConnection, "id">): Promise<void> {
    await ipc_addNewConnection.renderer!.trigger({ connection });
  },
  async editConnection(id: number, connection: Omit<StoredConnection, "id">): Promise<void> {
    await ipc_editConnection.renderer!.trigger({ id, connection });
  },
  async deleteConnection(id: number): Promise<void> {
    await ipc_deleteConnection.renderer!.trigger({ id });
  },
};

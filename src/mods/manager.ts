import { app } from "electron";
import path from "path";

import { downloadFile } from "./install/download";
import { ModInstallation } from "./install/installation";

export class ModManager {
  public getInstallation(): ModInstallation {
    return new ModInstallation();
  }

  public async downloadModFile(downloadUrl: string, filename?: string) {
    const downloadDir = path.join(app.getPath("userData"), "temp");
    await downloadFile(downloadUrl, downloadDir, this._onDownloadProgress, filename);
    this._onDownloadComplete();
  }

  public async installISOpatch(isoPath: string) {
    const modInstall = this.getInstallation();
    const downloadDir = path.join(app.getPath("userData"), "temp");
    await modInstall.installISO(path.join(downloadDir, "patch.xdelta"), downloadDir, isoPath);
  }

  private _onDownloadProgress(current: number, total: number) {
    const percent = (current / total) * 100;
    console.log(percent + "% downloaded");
    // this.eventSubject.next({
    //   type: DolphinEventType.DOWNLOAD_PROGRESS,
    //   dolphinType,
    //   progress: { current, total },
    // });
  }

  private _onDownloadComplete() {
    console.log("Download complete.");
    // this.eventSubject.next({
    //   type: DolphinEventType.DOWNLOAD_COMPLETE,
    //   dolphinType,
    // });
  }
}

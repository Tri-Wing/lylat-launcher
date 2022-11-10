import { app } from "electron";
import path from "path";

import { downloadFile } from "./install/download";
import { ModInstallation } from "./install/installation";

export class ModManager {
  public getInstallation(): ModInstallation {
    return new ModInstallation();
  }

  public async downloadModFile(downloadUrl: string, filename: string) {
    const downloadDir = path.join(app.getPath("userData"), "temp");
    await downloadFile(downloadUrl, downloadDir, this._onDownloadProgress, filename);
    this._onDownloadComplete();
  }

  public async installISOpatch(isoPath: string, destinationPath: string, fileName: string) {
    const modInstall = this.getInstallation();
    const downloadDir = path.join(app.getPath("userData"), "temp");
    await modInstall.installISO(path.join(downloadDir, fileName), destinationPath, isoPath);
  }

  private _onDownloadProgress(current: number, total: number) {
    const percent = (current / total) * 100;
    console.log(percent + "% downloaded");
  }

  private _onDownloadComplete() {
    console.log("Download complete.");
  }
}

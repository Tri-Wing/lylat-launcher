import { execFile } from "child_process";
import { unlink } from "fs";
import { getAssetPath } from "main/util";
import { async as AsyncStreamZip } from "node-stream-zip";

export async function installISOonWindows({
  assetPath,
  destinationPath,
  isoPath,
}: {
  assetPath: string;
  destinationPath: string;
  isoPath: string;
}) {
  const args = ["-d", "-f", "-s", isoPath, assetPath, destinationPath];
  await new Promise<void>((resolve, reject) => {
    execFile(getAssetPath("include", "xdelta.exe"), args, function (error) {
      if (error) {
        reject(error);
      } else {
        unlink(assetPath, (error) => {
          if (error) {
            reject(error);
          }
        });
        resolve();
      }
    });
  });
}

export async function installModFilesWindows({
  assetPath,
  destinationFolder,
  log = console.log,
}: {
  assetPath: string;
  destinationFolder: string;
  log?: (message: string) => void;
}) {
  log(`Extracting ${assetPath} to: ${destinationFolder}`);
  const zip = new AsyncStreamZip({ file: assetPath });
  await zip.extract(null, destinationFolder);
  await zip.close();
}

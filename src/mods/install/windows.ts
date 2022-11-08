import { execFile } from "child_process";
import { getAssetPath } from "main/util";
import { async as AsyncStreamZip } from "node-stream-zip";

export async function installISOonWindows({
  assetPath,
  destinationPath,
  isoPath,
  log = console.log,
}: {
  assetPath: string;
  destinationPath: string;
  isoPath: string;
  log?: (message: string) => void;
}) {
  log(`Patching ${isoPath} with ${assetPath} to ${destinationPath}`);
  const args = ["-d", "-f", "-s", isoPath, assetPath, destinationPath];
  await new Promise<void>((resolve, reject) => {
    execFile(getAssetPath("include", "xdelta.exe"), args, function (error) {
      if (error) {
        reject(error);
      } else {
        log("Patching complete, new ISO should be located in the folder");
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

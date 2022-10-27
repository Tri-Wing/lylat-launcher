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

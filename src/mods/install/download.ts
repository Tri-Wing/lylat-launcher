import log from "electron-log";
import path from "path";
import { googleDriveDownload } from "utils/googleDriveDownload";
// import { download } from "utils/download";

export async function downloadFile(
  downloadUrl: string,
  destinationFolder: string,
  onProgress?: (current: number, total: number) => void,
  filename?: string,
): Promise<string> {
  const parsedUrl = new URL(downloadUrl);
  const _filename = filename ?? path.basename(parsedUrl.pathname);
  const downloadLocation = path.join(destinationFolder, _filename);
  await googleDriveDownload({
    url: downloadUrl,
    destinationFile: downloadLocation,
    overwrite: true,
    onProgress: ({ transferredBytes, totalBytes }) => onProgress && onProgress(transferredBytes, totalBytes),
  });
  log.info(`Successfully downloaded ${downloadUrl} to ${downloadLocation}`);
  return downloadLocation;
}

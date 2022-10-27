import * as fs from "fs-extra";
import { dirname } from "path";
import { download as wgetDownload, request as wgetRequest } from "wget-improved";

import { fileExists } from "./fileExists";

export async function googleDriveDownload(options: {
  url: string;
  destinationFile: string;
  onProgress?: (progress: { transferredBytes: number; totalBytes: number }) => void;
  overwrite?: boolean;
}): Promise<void> {
  const { url, destinationFile, onProgress, overwrite } = options;

  if (!overwrite && (await fileExists(destinationFile))) {
    throw new Error(`Could not download to ${destinationFile}. File already exists!`);
  }

  // Make sure the folder exists
  await fs.ensureDir(dirname(destinationFile));

  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);

    const options = {
      protocol: parsedUrl.protocol,
      host: parsedUrl.hostname,
      path: parsedUrl.pathname + (parsedUrl.search || ""),
      method: "GET",
    };

    let redirectUrl = url;

    const req = wgetRequest(options, function (res) {
      if (res.statusCode === 303) {
        console.log("Got redirectUrl URL: " + res.headers.location);
        res.on("error", function (err) {
          console.log(err);
        });
        if (res.headers.location != undefined) {
          redirectUrl = res.headers.location;
        }

        let totalBytes = 0;

        const downloader = wgetDownload(redirectUrl!, destinationFile);
        downloader.on("error", (err) => {
          fs.unlink(destinationFile, () => {
            reject(err);
          });
        });
        downloader.on("start", (fileSize: number | null) => {
          if (fileSize !== null) {
            totalBytes = fileSize;
          }
        });
        downloader.on("end", () => {
          resolve();
        });
        downloader.on("bytes", (transferredBytes: number) => {
          onProgress && onProgress({ transferredBytes, totalBytes });
        });
      } else {
        console.log("Server respond " + res.statusCode);
        reject();
      }
    });
    req.end();
    req.on("error", function (err) {
      console.log(err);
    });
  });
}

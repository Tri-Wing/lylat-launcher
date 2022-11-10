import * as fs from "fs-extra";
import { dirname } from "path";
import { download as wgetDownload, request as wgetRequest } from "wget-improved";

import { fileExists } from "./fileExists";

async function getDirectUrl(url: string) {
  let parsedUrl = new URL(url);
  let newUrl = url;
  return new Promise<string>((resolve, reject) => {
    switch (parsedUrl.hostname) {
      case "drive.google.com":
        {
          //Check for non-direct links
          if (url.includes("share_link")) {
            const Id = url.replace("https://drive.google.com/file/d/", "").replace("/view?usp=share_link", "");
            newUrl = "https://drive.google.com/uc?export=download&id=" + Id;
            parsedUrl = new URL(newUrl);
          }
          const options = {
            protocol: parsedUrl.protocol,
            host: parsedUrl.hostname,
            path: parsedUrl.pathname + (parsedUrl.search || ""),
            method: "GET",
          };
          const req = wgetRequest(options, function (res) {
            if (res.statusCode === 303) {
              if (res.headers.location != undefined) {
                resolve(res.headers.location);
              }
            }
            res.on("error", function (err) {
              reject(err);
            });
          });
          req.end();
        }
        break;
      default:
        resolve(url);
        break;
    }
  });
}

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

  const directUrl = await getDirectUrl(url);

  return new Promise((resolve, reject) => {
    let finished = false;
    let percentPrev = 0;
    let totalBytes = 0;
    let timeout = false;
    const handleTimeout = function () {
      if (timeout) {
        fs.unlink(destinationFile, () => {
          finished = true;
        });
        reject(new Error("Download timed out."));
      } else if (!finished) {
        console.log("No timeout");
        timeout = true;
        setTimeout(handleTimeout, 5000);
      }
    };
    handleTimeout();

    const downloader = wgetDownload(directUrl, destinationFile);
    downloader.on("error", (err) => {
      fs.unlink(destinationFile, () => {
        finished = true;
        reject(err);
      });
    });
    downloader.on("start", (fileSize: number | null) => {
      if (fileSize !== null) {
        totalBytes = fileSize;
      }
    });
    downloader.on("end", () => {
      finished = true;
      resolve();
    });
    downloader.on("bytes", (transferredBytes: number) => {
      timeout = false;
      const percent = (transferredBytes / totalBytes) * 100;
      if (percent - percentPrev > 1.0) {
        percentPrev = percent;
        onProgress && onProgress({ transferredBytes, totalBytes });
      }
    });
  });
}

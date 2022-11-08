export enum DownloadType {
  ISOPATCH,
  DATFILE,
}

export interface ModService {
  downloadISOPatch(downloadUrl: string, isoPath: string, destinationPath: string): Promise<void>;
}

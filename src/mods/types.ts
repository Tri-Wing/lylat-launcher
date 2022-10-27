export enum DownloadType {
  ISOPATCH,
  DATFILE,
}

export interface ModService {
  downloadISOPatch(downloadUrl: string, isoPath: string): Promise<void>;
}

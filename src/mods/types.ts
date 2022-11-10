export enum DownloadType {
  ISOPATCH,
  DATFILE,
}

export enum ModCategory {
  ISOPATCH = "ISOPATCH",
  COSTUME = "COSTUME",
  STAGE = "STAGE",
  OTHER = "OTHER",
}

export enum Game {
  MELEE = "Melee",
  BRAWL = "Brawl",
}

export interface ModService {
  downloadISOPatch(downloadUrl: string, fileName: string): Promise<void>;
  installISOPatch(isoPath: string, destinationPath: string, fileName: string): Promise<void>;
}

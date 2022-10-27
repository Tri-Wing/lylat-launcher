export class ModInstallation {
  public async installISO(assetPath: string, destinationPath: string, isoPath: string) {
    switch (process.platform) {
      case "win32": {
        const { installISOonWindows } = await import("./windows");
        await installISOonWindows({ assetPath, destinationPath: destinationPath, isoPath: isoPath });
        break;
      }
      //TODO: add support for these platforms
      // case "darwin": {
      //   const { installISOonMac } = await import("./macos");
      //   await installISOonMac({ assetPath, destinationFolder: destinationPath });
      //   break;
      // }
      // case "linux": {
      //   const { installISOonLinux } = await import("./linux");
      //   await installISOonLinux({
      //     assetPath,
      //     destinationFolder: destinationPath,
      //   });
      //   break;
      // }
      default: {
        throw new Error(`Error, unsupported platform: ${process.platform}`);
      }
    }
  }
}

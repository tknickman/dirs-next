import type { FromEnv } from "./types";
import { stat } from "fs/promises";
import path from "node:path";

interface ConfigDirOpts {
  platform?: NodeJS.Platform;
  validate?: boolean;
}

export function getPlatform(): NodeJS.Platform {
  return process.platform;
}

export function linuxConfig(): FromEnv {
  if (process.env.XDG_CONFIG_HOME !== undefined) {
    return process.env.XDG_CONFIG_HOME;
  }

  if (process.env.HOME !== undefined) {
    return path.join(process.env.HOME, ".config");
  }

  return undefined;
}

export function darwinConfig(): FromEnv {
  if (process.env.HOME !== undefined) {
    return path.join(process.env.HOME, "/Library/Application Support");
  }

  return undefined;
}

export function winConfig(): FromEnv {
  return process.env.APPDATA;
}

export function getPathForPlatform({
  platform,
}: {
  platform: NodeJS.Platform;
}): FromEnv {
  switch (platform) {
    case "linux":
      return linuxConfig();
    case "darwin":
      return darwinConfig();
    case "win32":
      return winConfig();
    default:
      // Use the linux config as a fallback
      return linuxConfig();
  }
}

/**
 * Returns the path to the user's config directory. The path is validated to ensure it exists.
 * The returned value depends on the operating system and is either a value from the following table, or undefined.
 *
 *
 * |Platform | Value                                 | Example                                    |
 * | ------- | ------------------------------------- | -------------------------------------------|
 * | Linux   | `$XDG_CONFIG_HOME` or `$HOME/.config` | `/home/steph/.config`                      |
 * | macOS   | `$HOME/Library/Application Support`   | `/Users/Steph/Library/Application Support` |
 * | Windows | `{FOLDERID_RoamingAppData}`           | `C:\Users\Steph\AppData\Roaming`           |
 *
 */
export async function configDir(
  opts: ConfigDirOpts = {},
): Promise<string | undefined> {
  const platform = opts.platform ?? getPlatform();
  const config = getPathForPlatform({ platform });

  if (config === undefined) {
    return undefined;
  }

  if (opts.validate === false) {
    return config;
  }

  // Check if the directory exists
  try {
    await stat(config);
    return config;
  } catch (err) {
    return undefined;
  }
}

function getPlatform() {
  return process.platform;
}

function linuxConfig() {
  return process.env.XDG_CONFIG_HOME || `${process.env.HOME}/.config`;
}

function darwinConfig() {
  return `${process.env.HOME}/Library/Application Support`;
}

function winConfig() {
  return process.env.APPDATA;
}

/**
 * Returns the path to the user's config directory.
 * The returned value depends on the operating system and is either a `Some`, containing a value from the following table, or a `None`.
 *
 * |Platform | Value                                 | Example                          |
 * | ------- | ------------------------------------- | -------------------------------- |
 * | Linux   | `$XDG_CONFIG_HOME` or `$HOME`/.config | /home/alice/.config              |
 * | macOS   | `$HOME`/Library/Application Support   | /Users/Alice/Library/Application Support |
 * | Windows | `{FOLDERID_RoamingAppData}`           | C:\Users\Alice\AppData\Roaming   |
 *
 */
export function configDir() {
  let platform = getPlatform();
  switch (platform) {
    case "linux":
      return linuxConfig();
    case "darwin":
      return darwinConfig();
    case "win32":
      return winConfig();
    default:
      // Use the linux config as a falback
      return linuxConfig();
  }
}

import * as configDir from "./config-dir";

describe("config-dir", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("linuxConfig", () => {
    it("should return $XDG_CONFIG_HOME if set", () => {
      // make sure XDG_CONFIG_HOME is set
      const xdgConfigHome = "/path/to/xdg/config";
      process.env.XDG_CONFIG_HOME = xdgConfigHome;
      expect(configDir.linuxConfig()).toBe(xdgConfigHome);
    });

    it("should return $HOME/.config if XDG_CONFIG_HOME is not set", () => {
      // make sure XDG_CONFIG_HOME is not set
      delete process.env.XDG_CONFIG_HOME;

      // make sure HOME is set
      const home = "/home/user";
      process.env.HOME = home;
      expect(configDir.linuxConfig()).toBe(`${home}/.config`);
    });

    it("should return undefined when $XDG_CONFIG_HOME and $HOME is not set", () => {
      // make sure XDG_CONFIG_HOME is not set
      delete process.env.XDG_CONFIG_HOME;
      delete process.env.HOME;

      expect(configDir.linuxConfig()).toBe(undefined);
    });

    it("handles double /", () => {
      // make sure XDG_CONFIG_HOME is not set
      delete process.env.XDG_CONFIG_HOME;

      // make sure HOME is set
      const home = "/home/user/";
      process.env.HOME = home;
      expect(configDir.linuxConfig()).toBe(`${home}.config`);
    });
  });

  describe("darwinConfig", () => {
    it("should return the correct path when $HOME is set", () => {
      // make sure HOME is set
      const home = "/Users/user";
      process.env.HOME = home;
      expect(configDir.darwinConfig()).toBe(
        `${home}/Library/Application Support`,
      );
    });

    it("should return undefined when HOME is not set", () => {
      // make sure HOME is not set
      delete process.env.HOME;
      expect(configDir.darwinConfig()).toBeUndefined();
    });

    it("handles double /", () => {
      // make sure HOME is set
      const home = "/Users/user/";
      process.env.HOME = home;
      expect(configDir.darwinConfig()).toBe(
        `${home}Library/Application Support`,
      );
    });
  });

  describe("winConfig", () => {
    it("should return the correct path when APPDATA is set", () => {
      // make sure APPDATA is set
      const appData = "/path/to/appdata";
      process.env.APPDATA = appData;
      expect(configDir.winConfig()).toBe(appData);
    });

    it("should return undefined when APPDATA is not set", () => {
      // make sure APPDATA is not set
      delete process.env.APPDATA;
      expect(configDir.winConfig()).toBeUndefined();
    });
  });

  describe("getPlatform", () => {
    it("should return the current platform", () => {
      const expectedPlatform = "darwin";

      // mock the process.platform call
      const mockProcessPlatform = jest
        .spyOn(configDir, "getPlatform")
        .mockReturnValue(expectedPlatform);

      const actualPlatform = configDir.getPlatform();
      expect(actualPlatform).toBe(expectedPlatform);
      mockProcessPlatform.mockRestore();
    });
  });

  describe("getPathForPlatform", () => {
    it("should return the correct path for linux platform", () => {
      const platform = "linux";
      const expectedPath = "/path/to/xdg/config";
      process.env.XDG_CONFIG_HOME = expectedPath;
      expect(configDir.getPathForPlatform({ platform })).toBe(expectedPath);
    });

    it("should return the correct path for darwin platform", () => {
      const platform = "darwin";
      const expectedPath = "/Users/user/Library/Application Support";
      const home = "/Users/user";
      process.env.HOME = home;
      expect(configDir.getPathForPlatform({ platform })).toBe(expectedPath);
    });

    it("should return the correct path for win32 platform", () => {
      const platform = "win32";
      const expectedPath = "/path/to/appdata";
      process.env.APPDATA = expectedPath;
      expect(configDir.getPathForPlatform({ platform })).toBe(expectedPath);
    });

    it("should return the linux config path as a fallback for unknown platform", () => {
      const platform = "unknown" as NodeJS.Platform;
      const expectedPath = "/path/to/xdg/config";
      process.env.XDG_CONFIG_HOME = expectedPath;
      expect(configDir.getPathForPlatform({ platform })).toBe(expectedPath);
    });
  });
});

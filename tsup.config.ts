import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  dts: true,
  clean: true,
  minify: process.env.NODE_ENV === "production",
  format: ["cjs"],
  splitting: true,
  entry: ["src/**/*.ts"],
  ...options,
}));

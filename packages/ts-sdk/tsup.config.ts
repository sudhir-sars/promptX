import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  // @promptx/shared is a workspace package; bundle it into the published
  // output so external consumers don't need to resolve it.
  noExternal: ["@promptx/shared"],
});

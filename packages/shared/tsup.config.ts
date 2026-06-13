import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "types/index": "src/types/index.ts",
    "contracts/index": "src/contracts/index.ts",
    "constants/index": "src/constants/index.ts",
    "utils/index": "src/utils/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  // Framework-agnostic: must run on browser, Node, and Cloudflare Workers.
  target: "es2022",
  platform: "neutral",
});

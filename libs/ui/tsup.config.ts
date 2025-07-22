import { defineConfig } from "tsup";
// import { readFileSync, writeFileSync } from "fs";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react"],
  minify: false,
  // onSuccess: async () => {
  //   // Copy globals.css to dist
  //   try {
  //     const cssContent = readFileSync("src/shadcn/styles/globals.css", "utf-8");
  //     writeFileSync("dist/globals.css", cssContent);
  //     console.log("✅ Copied globals.css to dist/");
  //   } catch (error) {
  //     console.error("❌ Failed to copy globals.css:", error);
  //   }
  // }
});
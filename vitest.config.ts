import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Provision an isolated SQLite DB under os.tmpdir() once per run so
    // tests never depend on the developer's local prisma/dev.db.
    globalSetup: ["./src/__tests__/helpers/global-setup.ts"],
    // Component tests need DOM. setupFiles polyfills localStorage which jsdom
    // 29 + vitest 4 don't wire up correctly out of the box.
    setupFiles: ["./src/__tests__/helpers/dom-setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

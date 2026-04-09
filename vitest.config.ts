import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    // Provision an isolated SQLite DB under os.tmpdir() once per run so
    // tests never depend on the developer's local prisma/dev.db.
    globalSetup: ["./src/__tests__/helpers/global-setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

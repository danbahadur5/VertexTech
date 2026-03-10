import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["app/__tests__/**/*.{test,spec}.{ts,tsx}"],
    css: false
  }
});

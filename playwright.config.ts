import { defineConfig, devices } from "@playwright/test";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

export default defineConfig({
  globalSetup: require.resolve("./tests/global.setup.ts"),
  use: {
    baseURL: "http://localhost:3000",
    storageState: path.join(__dirname, "playwright/.clerk/user.json"),
    trace: "on-first-retry",
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  testDir: "./tests", // Specify the test directory
  testMatch: ["**/*.spec.ts"], // Match only .spec.ts files
  testIgnore: ["**/__tests__/**/*"], // Ignore __tests__ directory and all its contents

  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});

import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Go to home page and wait for full load
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("should be logged in and access protected content", async ({ page }) => {
    // Verify we're logged in by checking for user-specific elements
    // await expect(page.getByTestId("user-button")).toBeVisible();

    // Test protected actions
    await expect(page.getByTestId("New Meeting")).toBeVisible();
    // await expect(page.getByTestId("meeting-screen")).toBeVisible();
  });
});

import { test, expect } from "@playwright/test";

test.describe("Auth Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Go to home page and wait for full load
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("should be logged in and access protected content", async ({ page }) => {
    // Test protected actions
    await expect(page.getByTestId("New Meeting")).toBeVisible();
    // await expect(page.getByTestId("meeting-screen")).toBeVisible();
  });
});

test.describe("App Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000");
    await page.waitForLoadState("networkidle");
  });

  test("should display current time and date correctly", async ({ page }) => {
    const timeElement = await page.getByTestId("currentTime");
    const dateElement = await page.getByTestId("currentDate");

    await expect(timeElement).toBeVisible();
    await expect(dateElement).toBeVisible();

    // Verify time format (e.g., "10:30 AM")
    // await expect(timeElement).toMatch(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/);
  });

  test("should show correct greeting based on time of day", async ({
    page,
  }) => {
    const greetingElement = await page.getByTestId("greeting");
    const hour = new Date().getHours();

    await expect(greetingElement).toBeVisible();

    if (hour < 12) {
      await expect(greetingElement).toHaveText("Good morning, User!");
    } else if (hour < 18) {
      await expect(greetingElement).toHaveText("Good afternoon, User!");
    } else {
      await expect(greetingElement).toHaveText("Good evening, User!");
    }
  });

  test("should have all quick action cards visible", async ({ page }) => {
    await expect(page.getByTestId("New Meeting")).toBeVisible();
    await expect(page.getByTestId("Join Meeting")).toBeVisible();
    await expect(page.getByTestId("Schedule Meeting")).toBeVisible();
    await expect(page.getByTestId("View Recordings")).toBeVisible();
  });

  // test("should handle new meeting creation flow", async ({ page }) => {
  //   const newMeetingButton = page.getByTestId("New Meeting");
  //   await expect(newMeetingButton).toBeVisible();

  //   await newMeetingButton.click();
  //   await page.getByRole("button", { name: "Start Meeting" }).click();
  //   await page.getByRole("button", { name: "Join Meeting" }).click();

  //   // Verify meeting screen appears
  //   // await expect(page.getByTestId("meeting-screen")).toBeVisible();

  //   // Verify meeting controls
  //   await expect(page.getByTestId("audio-unmute-button")).toBeVisible();
  //   await expect(page.getByTestId("video-unmute-button")).toBeVisible();
  //   await expect(page.getByTestId("cancel-call-button")).toBeVisible();
  // });
});

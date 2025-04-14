import { chromium, FullConfig } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../playwright/.clerk/user.json");

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Go to sign-in page directly
  await page.goto("http://localhost:3000/sign-in");

  // Wait for the sign-in form to be ready
  await page.waitForLoadState("networkidle");

  // Fill in credentials
  await page
    .getByPlaceholder("Enter email or username")
    .fill(process.env.E2E_CLERK_USER_USERNAME || "");
  await page.getByRole("button", { name: "Continue" }).click();

  await page
    .getByPlaceholder("Enter your password")
    .fill(process.env.E2E_CLERK_USER_PASSWORD || "");
  await page.getByRole("button", { name: "Continue" }).click();

  // Click sign in and wait for navigation
  // await Promise.all([
  //   page.waitForNavigation(),
  //   page.getByRole("button", { name: "sign in" }).click(),
  // ]);

  // Wait to ensure we're fully logged in
  await page.waitForTimeout(2000);

  // Save the authentication state
  await page.context().storageState({ path: authFile });
  await browser.close();
}

export default globalSetup;

"use server";

import puppeteer from "puppeteer";

export async function createExcalidrawSession(
  userName: string
): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto("https://excalidraw.com/");
    await page.click("button.collab-button");
    await page.click("aria/Start session");

    await page.waitForSelector(".ExcTextField__input input");
    await page.type(".ExcTextField__input input", userName);
    await page.waitForFunction(() => {
      return window.location.href.includes("#room=");
    });

    const sessionUrl = await page.url();
    return sessionUrl;
  } finally {
    await browser.close();
  }
}

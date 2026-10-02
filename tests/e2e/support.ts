import {
  test as base,
  expect,
  type Locator,
  type Page,
} from "@playwright/test";

export const missingPath = "/__foundation_missing_page__";

// Shared by both specs: no provider calls, uncaught errors or unrelated failed assets.
export const test = base.extend({
  page: async ({ page, baseURL }, runTest) => {
    const errors: string[] = [];
    const origin = new URL(baseURL!).origin;
    const missingURL = new URL(missingPath, baseURL).href;

    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() !== "error") return;
      // Chromium reports the intentional top-level HTTP 404 as a resource error.
      // Allow only that exact URL/message; application logs and other 404s still fail.
      if (
        message.location().url === missingURL &&
        message.text() ===
          "Failed to load resource: the server responded with a status of 404 (Not Found)"
      )
        return;
      errors.push(`console: ${message.text()} (${message.location().url})`);
    });
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== origin) {
        errors.push(
          `Unexpected external request: ${url.origin}${url.pathname}`,
        );
        await route.abort("blockedbyclient");
        return;
      }
      await route.continue();
    });

    await runTest(page);
    expect(errors, "Browser errors or external-service requests").toEqual([]);
  },
});

export { expect };

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  expect(dimensions.body).toBeLessThanOrEqual(dimensions.viewport);
}

export async function expectContentFits(page: Page, locator: Locator) {
  await expect(locator).toBeVisible();
  await locator.scrollIntoViewIfNeeded();
  await expect(locator).toBeInViewport({ ratio: 1 });
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  const clipped = await locator.evaluate((element) => {
    let current: Element | null = element;
    while (current) {
      const style = getComputedStyle(current);
      // Text may extend beyond its line box when overflow is visible.
      // Check the element and ancestors only where CSS actually clips it.
      if (
        (["hidden", "clip"].includes(style.overflowX) &&
          current.scrollWidth > current.clientWidth) ||
        (["hidden", "clip"].includes(style.overflowY) &&
          current.scrollHeight > current.clientHeight)
      ) {
        return true;
      }
      current = current.parentElement;
    }
    return false;
  });
  expect(clipped, "Essential content must not be clipped").toBe(false);
}

import AxeBuilder from "@axe-core/playwright";
import { test, expect, missingPath } from "./support";

for (const [id, path, status] of [
  ["A11Y-01", "/", 200],
  ["A11Y-02", missingPath, 404],
] as const) {
  test(`${id}: ${path} has no supported WCAG A/AA violations`, async ({
    page,
  }, testInfo) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(status);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    await testInfo.attach("axe-results", {
      body: JSON.stringify(results, null, 2),
      contentType: "application/json",
    });
    expect(results.violations).toEqual([]);
  });
}

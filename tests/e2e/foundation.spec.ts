import {
  test,
  expect,
  missingPath,
  expectContentFits,
  expectNoHorizontalOverflow,
} from "./support";

test("FOUND-01: landing page identifies the restaurant and demonstration without overflow", async ({
  page,
}) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  const main = page.getByRole("main");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(main).toHaveCount(1);
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText(/Lumière Kitchen/);
  await expectContentFits(page, heading);
  await expectContentFits(
    page,
    page.getByRole("contentinfo").getByText(/Arizonix demonstration project/i),
  );
  await expectContentFits(
    page,
    main.getByText(/bookings are not available yet/i),
  );
  await expectNoHorizontalOverflow(page);
});

test("FOUND-02: not-found page returns 404 and provides keyboard recovery at every width", async ({
  page,
}) => {
  const response = await page.goto(missingPath);
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByText("Page not found", { exact: true })).toBeVisible();
  await expectContentFits(page, page.getByRole("heading", { level: 1 }));
  const recovery = page.getByRole("link", { name: "Back to home" });
  await expectContentFits(page, recovery);
  const box = await recovery.boundingBox();
  expect(box!.height).toBeGreaterThanOrEqual(44);
  expect(box!.width).toBeGreaterThanOrEqual(44);
  await expectNoHorizontalOverflow(page);

  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(recovery).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Lumière Kitchen/,
  );
});

test("FOUND-03: skip link moves keyboard focus to main content", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to content" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
});

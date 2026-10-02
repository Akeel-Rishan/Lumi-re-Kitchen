import {
  test,
  expect,
  missingPath,
  expectContentFits,
  expectNoHorizontalOverflow,
} from "./support";

test("DESIGN-01: nested admin tokens inherit and public scope can be restored", async ({
  page,
}) => {
  await page.goto("/");
  const main = page.getByRole("main");
  const heading = page.getByRole("heading", { level: 1 });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "public");
  await expect(heading).toHaveCSS(
    "font-family",
    'Georgia, "Times New Roman", serif',
  );
  const publicSize = await heading.evaluate(
    (el) => getComputedStyle(el).fontSize,
  );
  try {
    await main.evaluate((el) => el.setAttribute("data-theme", "admin"));
    await expect(main).toHaveCSS("background-color", "rgb(243, 245, 244)");
    await expect(heading).toHaveCSS(
      "font-family",
      '"Segoe UI", Arial, Helvetica, sans-serif',
    );
    await expect(heading).toHaveCSS("font-size", "36px");
    await expect(main).toHaveCSS("font-variant-numeric", "tabular-nums");
    // A nested public island must reset the inherited admin heading and numerals.
    await heading.evaluate((el) => el.setAttribute("data-theme", "public"));
    await expect(heading).toHaveCSS(
      "font-family",
      'Georgia, "Times New Roman", serif',
    );
    await expect(heading).toHaveCSS("font-size", publicSize);
    await expect(heading).toHaveCSS("font-variant-numeric", "lining-nums");
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      "rgb(247, 244, 237)",
    );
  } finally {
    await main.evaluate((el) => el.removeAttribute("data-theme"));
    await heading.evaluate((el) => el.removeAttribute("data-theme"));
  }
  await expect(heading).toHaveCSS("font-size", publicSize);
});

for (const [label, route] of [
  ["landing", "/"],
  ["not-found", missingPath],
]) {
  test(`DESIGN-02: ${label} remains readable with doubled base text`, async ({
    page,
  }, testInfo) => {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    await testInfo.attach(`${label}-normal`, {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    });
    try {
      // Text enlargement/reflow probe, not a claim of native browser zoom.
      await page.locator("html").evaluate((el) => {
        el.style.fontSize = "200%";
      });
      await expect(page.locator("body")).toHaveCSS("font-size", "32px");
      await expectContentFits(page, page.getByRole("heading", { level: 1 }));
      await expectContentFits(page, page.locator(".introduction"));
      await expectContentFits(page, page.locator(".disclosure"));
      if (route === "/")
        await expectContentFits(page, page.locator(".reservation-note"));
      else
        await expectContentFits(
          page,
          page.getByRole("link", { name: "Back to home" }),
        );
      await expectNoHorizontalOverflow(page);
      await testInfo.attach(`${label}-text-200-percent`, {
        body: await page.screenshot({ fullPage: true }),
        contentType: "image/png",
      });
    } finally {
      await page.locator("html").evaluate((el) => {
        el.style.removeProperty("font-size");
      });
    }
  });
}

test("DESIGN-03: keyboard focus stays visible and reduced motion removes transitions", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
  await page.goto(missingPath);
  // OS dark preference must not silently recolour this light-only foundation.
  await expect(page.locator("body")).toHaveCSS(
    "background-color",
    "rgb(247, 244, 237)",
  );
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const recovery = page.getByRole("link", { name: "Back to home" });
  await expect(recovery).toBeFocused();
  await expect(recovery).toHaveCSS("outline-style", "solid");
  await expect(recovery).toHaveCSS("outline-width", "3px");
  await expect(recovery).toHaveCSS("outline-color", "rgb(24, 76, 58)");
  await expect(recovery).toHaveCSS("outline-offset", "4px");
  await expect(recovery).toHaveCSS("transition-duration", "0s, 0s");
  await testInfo.attach("recovery-keyboard-focus", {
    body: await page.screenshot({ fullPage: true }),
    contentType: "image/png",
  });
});

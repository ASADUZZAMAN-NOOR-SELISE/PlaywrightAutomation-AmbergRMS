const { test, expect } = require('@playwright/test');

test("Support", async ({ page }) => {
  await page.goto("https://dev-amberg.seliselocal.com/login");
  await page.getByRole("button", { name: "Login submit button" }).click();
  await page.goto("https://dev-amberg.seliselocal.com/projects");
  await page.getByRole("button", { name: "Support" }).click();
  await page.getByRole("menuitem", { name: "About" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  console.log("Dialog is visible");

  // Required labels
  await expect(dialog.getByText("Version")).toBeVisible();
  await expect(dialog.getByText("Build Number")).toBeVisible();
  await expect(dialog.getByText("Release Date")).toBeVisible();

  //   Available licenses
  await expect(dialog.getByLabel("PlusExpiryFeature")).toBeVisible();
  await expect(
    dialog.getByLabel("PlusExpiryFeatureProRailVersion"),
  ).toBeVisible();

  // Privacy policy
  await expect(
    dialog.getByRole("link", { name: /privacy policy/i }),
  ).toBeVisible();

  //build number should be shown correctly
  const buildRow = dialog.locator('span:text("Build Number")').locator("..");
  await expect(buildRow).toContainText("20260204.1898");
});

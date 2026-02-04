import { test, expect } from "@playwright/test";

test("Support", async ({ page }) => {
  await page.goto("https://dev-amberg.seliselocal.com/login");
  await page.getByRole("button", { name: "Login submit button" }).click();
  await page.goto("https://dev-amberg.seliselocal.com/projects");
  await page.getByRole("button", { name: "Support" }).click();
  await page.getByRole("menuitem", { name: "About" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  console.log("Dialog is visible");

  await expect(dialog.getByText("About Amberg Track Pro Office")).toBeVisible();
  console.log("Heading is visible");

  await expect(page.getByRole("img", { name: "amberg logo" })).toBeVisible();
  console.log("Logo is visible");
});

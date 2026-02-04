import { test, expect } from "@playwright/test";
import { LoginPage } from "../Modules/Login/loginPage";

let webContext;

test.beforeAll("Homepage to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await loginPage.goto();
    await page.locator(".MuiGrid-root").nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("Support About modal validation", async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  console.log("Navigated to dashboard");

  await page.getByRole("button", { name: "Support" }).click();
  await page.getByRole("menuitem", { name: "About" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  console.log("About dialog is visible");

  await expect(dialog.getByText("Version", { exact: true })).toHaveText(
    "Version",
  );
  await expect(dialog.getByText("Build Number", { exact: true })).toHaveText(
    "Build Number",
  );
  await expect(dialog.getByText("Release Date", { exact: true })).toHaveText(
    "Release Date",
  );
  console.log("Required labels are present");

  await expect(dialog.getByLabel("PlusExpiryFeature")).toBeVisible();
  await expect(
    dialog.getByLabel("PlusExpiryFeatureProRailVersion"),
  ).toBeVisible();
  console.log("License rows are visible");

  await expect(
    dialog.getByRole("link", { name: /privacy policy/i }),
  ).toBeVisible();
  console.log("Privacy policy link is visible");

  const buildRow = dialog
    .getByText("Build Number", { exact: true })
    .locator("..");
  await expect(buildRow).toContainText("20260204.1898");
  console.log("Build number is correct");

  const versionRow = dialog.getByText("Version", { exact: true }).locator("..");
  await expect(versionRow).toContainText("1.7");
  console.log("Version number is correct");
});

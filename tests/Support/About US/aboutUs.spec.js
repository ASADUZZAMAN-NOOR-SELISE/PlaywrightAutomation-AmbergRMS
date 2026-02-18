const { test, expect } = require("@playwright/test");
import { LoginPage } from "../../../Utils/loginPage";
import { AboutUsPage } from "./aboutUs.page";

let webContext;

const verifyVersion = "1.7";

test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await loginPage.goto();
    await page.locator(".MuiGrid-root").nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
    console.log("Login successful, proceeding with tests.");
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("About us modal validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const supportAbout = new AboutUsPage(page);

  await loginPage.goto();

  await supportAbout.openAboutDialog();
  await supportAbout.verifyDialogIsVisible();
  await supportAbout.verifyRequiredLabels();
  await supportAbout.verifyLicenseRows();
  await supportAbout.verifyVersion(verifyVersion);

  const link = await supportAbout.privacyPolicyLink();
  await expect(link).toBeVisible();

  const privacyPage = await supportAbout.openPrivacyPolicy();
  await privacyPage.getByRole("button", { name: "Accept all" }).click();
  await expect(privacyPage).toHaveURL(
    "https://ambergtechnologies.com/downloads/company",
  );

  await privacyPage.close();
  await page.bringToFront();
  await supportAbout.verifyDialogIsVisible();
  await supportAbout.closeAboutDialog();
  await supportAbout.verifyDialogIsNotVisible();

  console.log("About Us modal tests passed successfully.");
});

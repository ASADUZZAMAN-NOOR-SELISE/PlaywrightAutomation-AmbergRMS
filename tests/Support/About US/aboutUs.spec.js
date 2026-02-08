import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import { AboutUsPage } from "./aboutUs.page";

let webContext;

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
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("Support about us modal validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const supportAbout = new AboutUsPage(page);

  await loginPage.goto();

  await supportAbout.openAboutDialog();

  await supportAbout.verifyDialogIsVisible();

  await supportAbout.verifyRequiredLabels();

  await supportAbout.verifyLicenseRows();

  await supportAbout.verifyBuildNumber("20260204.1898");

  await supportAbout.verifyVersion("1.7");

  await supportAbout.privacyPolicyLink().isVisible();

  const privacyPage = await supportAbout.openPrivacyPolicy();

  await privacyPage.getByRole("button", { name: "Accept all" }).click();

  await expect(privacyPage).toHaveURL(
    "https://ambergtechnologies.com/downloads/company",
  );

  console.log("About Us modal tests passed successfully.");
});

import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import { SSLCertificatePage } from "./sslCertificate.page";

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
    console.log("Login successful, proceeding with tests.");
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("SSL Certificate modal validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const sslCertificatePage = new SSLCertificatePage(page);
  await loginPage.goto();

  await sslCertificatePage.openSSLCertificateDialog();
  await sslCertificatePage.verifyDialogIsVisible();
  await sslCertificatePage.verifyWarningIcon();
  await sslCertificatePage.closeSSLCertificateDialog();

  console.log("SSL Certificate modal tests passed successfully.");
});

const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../../Utils/loginPage';
import { ContactUsPage } from './contactUs.page';

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

test("Contact us modal validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const supportContact = new ContactUsPage(page);
  await loginPage.goto();
  await supportContact.openContactUsDialog();
  await supportContact.verifyDialogIsVisible();
  await supportContact.logoVisible();
  await supportContact.verifyContactDetails();
  await supportContact.emailRedirected();

  console.log("Contact Us modal tests passed successfully.");
});

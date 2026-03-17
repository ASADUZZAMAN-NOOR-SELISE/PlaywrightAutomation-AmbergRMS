import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import CustomerInformationPage from "./customerInformation.page";
import { data } from "../../../Utils/Data/information";

let webContext;

test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await page.locator(".MuiGrid-root").nth(1).isVisible();
  await loginPage.verifyInitialState();
  await loginPage.login();
  await loginPage.logoutVisible();

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("Customer Information validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const customerInformationPage = new CustomerInformationPage(page);

  await loginPage.goto();
  await customerInformationPage.navigateToCustomerInfo();
  await customerInformationPage.verifyCustomerInformation(data.customerData);

  console.log("Customer Information tests passed successfully.");
});

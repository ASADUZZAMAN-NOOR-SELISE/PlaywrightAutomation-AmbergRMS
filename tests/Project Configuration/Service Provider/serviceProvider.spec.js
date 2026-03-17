import { test, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../../../Utils/loginPage";
import { data } from "../../../Utils/Data/Information";
import ServiceProviderPage from "./serviceProvider.page";
const filePath = path.join(__dirname, "./Data/Images/human-resource.png");

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

test("Service Provider validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const serviceProviderPage = new ServiceProviderPage(page);

  await loginPage.goto();
  await serviceProviderPage.navigateToServiceProviderInfo();
  await serviceProviderPage.verifyServiceProviderInformation(
    data.serviceProviderData,
  );
  await serviceProviderPage.editServiceProviderInformation(
    data.updatedServiceProviderData,
    filePath,
  );
  await serviceProviderPage.verifyUpdatedServiceProviderInformation(
    data.updatedServiceProviderData,
  );

  console.log("Service Provider tests passed successfully.");
});

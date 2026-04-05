import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import SpeedZonePage from "./speedZone.page";
import { Common } from "../../../Utils/common";
import { data } from "../../../Utils/Data/Information";

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

test.beforeEach("Create new project", async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
    name: data.templateName.en13848,
    ...data.project,
  });
  await common.fillServiceProviderInfo(data.serviceProviderData);
  await common.submitProject();
  await expect(common.newProjectButton).toBeVisible();
});

test("Speed Zone validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const speedZonePage = new SpeedZonePage(page);

  await loginPage.goto();
  await speedZonePage.navigateToSpeedZone();
  await speedZonePage.addSpeedZone();
  await speedZonePage.verifyLimitTables();
  console.log("Speed Zone tests passed successfully.");
});

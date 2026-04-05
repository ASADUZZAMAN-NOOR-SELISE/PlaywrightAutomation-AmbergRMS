import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import SpeedZonePage from "./speedZone.page";
import { Common } from "../../../Utils/common";
import { data } from "../../../Utils/Data/Information";
import AdjustSpeedZonePage from "./adjustSpeedZone.page";

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
    name: `${data.templateName.en13848}-speedzone`,
    ...data.project,
  });
  await common.fillServiceProviderInfo(data.serviceProviderData);
  await common.submitProject();
  await expect(common.newProjectButton).toBeVisible();
});

test("Speed Zone: full flow", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const speedZonePage = new SpeedZonePage(page);

  await test.step("Navigate to Speed Zone", async () => {
    await loginPage.goto();
    await speedZonePage.navigateToSpeedZone();
  });

  await test.step("Add Speed Zone", async () => {
    await speedZonePage.addSpeedZone();
  });

  await test.step("Verify limit tables", async () => {
    await speedZonePage.verifyLimitTables();
  });

  await test.step("Delete Speed Zones", async () => {
    await speedZonePage.deleteSpeedZone();
  });

  await page.close();
});

test("Speed Zone: Delete middle speed zone", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const adjustSpeedZonePage = new AdjustSpeedZonePage(page);

  await test.step("Delete middle speed zone", async () => {
    await loginPage.goto();
    await adjustSpeedZonePage.deleteMiddleSpeedZone();
  });

  await page.close();

  console.log("Speed Zone tests passed successfully.");
});

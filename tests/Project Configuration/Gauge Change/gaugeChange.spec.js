import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import { Common } from "../../../Utils/common";
import GauageChangePage from "./gaugeChange.page";
import { data } from "../../../Utils/Data/Information";
import EditUnitPage from "../Edit Unit Settings/editUnit.page";

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
  const editUnit = new EditUnitPage(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
    name: `${data.templateName.en13848}-gaugechange`,
    ...data.project,
  });
  await common.submitProject();
  await expect(common.newProjectButton).toBeVisible();

  // Set unit to meter for the project
  await editUnit.setUnitMeter();
});

test("Gauge Change validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const gaugeChangePage = new GauageChangePage(page);

  await loginPage.goto();
  await gaugeChangePage.navigateToGaugeChange();
  await gaugeChangePage.editGaugeChange();

  console.log("Gauge Change tests passed successfully.");
});

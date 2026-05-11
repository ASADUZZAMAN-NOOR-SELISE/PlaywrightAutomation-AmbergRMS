import { test, expect } from "@playwright/test";
import { LoginPage } from "../../../Utils/loginPage";
import { Common } from "../../../Utils/common";
import { data } from "../../../Utils/Data/Information.js";
import HorizontalAlignmentPage from "./horizontalAlignment.page.js";
import EditUnitPage from "../EditUnitSettings/editUnit.page.js";

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
    name: `${data.templateName.en13848}-horizontal-alignment`,
    ...data.project,
  });
  await common.fillServiceProviderInfo(data.serviceProviderData);
  await common.submitProject();
  await expect(common.newProjectButton).toBeVisible();

  // Set unit to meter for the project
  await editUnit.setUnitMeter();
});

test("Horizontal Alignment validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const horizontalAlignmentPage = new HorizontalAlignmentPage(page);
  await loginPage.goto();
  await horizontalAlignmentPage.navigateToHA();
  await horizontalAlignmentPage.verifyMandatoryFieldValidation();
  await horizontalAlignmentPage.addChordLength();

  console.log("Horizontal Alignment tests passed successfully.");
});

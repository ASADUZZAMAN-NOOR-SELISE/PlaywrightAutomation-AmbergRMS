import { test, expect } from "@playwright/test";
import path from "path";
import { LoginPage } from "../../../Utils/loginPage";
import CustomerInformationPage from "./customerInformation.page";
import { data } from "../../../Utils/Data/Information";
import { Common } from "../../../Utils/common";
import EditUnitPage from "../Edit Unit Settings/editUnit.page";
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

test.beforeEach("Create new project", async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const editUnit = new EditUnitPage(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
    name: `${data.templateName.en13848}-customerinfo`,
    ...data.project,
  });
  await common.customerInformation(data.customerData);
  await common.submitProject();
  await expect(common.newProjectButton).toBeVisible();

  // Set unit to meter for the project
  await editUnit.setUnitMeter();
});

test("Customer Information validation", async () => {
  const page = await webContext.newPage();

  const loginPage = new LoginPage(page);
  const customerInformationPage = new CustomerInformationPage(page);

  await loginPage.goto();
  await customerInformationPage.navigateToCustomerInfo();
  await customerInformationPage.verifyCustomerInformation(data.customerData);
  await customerInformationPage.editCustomerInformation(
    data.updatedCustomerData,
    filePath,
  );
  await customerInformationPage.verifyUpdatedCustomerInformation(
    data.updatedCustomerData,
  );

  console.log("Customer Information tests passed successfully.");
});

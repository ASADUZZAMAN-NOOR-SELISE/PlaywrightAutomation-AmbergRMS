const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Login/loginPage');
const { Common } = require('../Utils/common');
const { data } = require('../Utils/Data/Information');

let webContext;

test.beforeAll('Homepaeg to dashboard ', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  try {
    await loginPage.goto();
    await page.locator('.MuiGrid-root').nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: 'login-failure.png', fullPage: true });
    console.error(' Login test failed:', error.message);
    throw error;
  }
  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('Error text validation : empty project name field', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  await loginPage.goto();
  await common.clickNewProject();
  await common.submitProject();
  const errorText = await common.getProjectNameErrorText();
  expect(errorText).toBe('Name is required');
  console.log(errorText);
});

test('Error text validation : Email', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
      name: data.templateName.stn,
      number: data.project.number,
      startPlace:data.project.startPlace,
      endPlace: data.project.endPlace,
      stationingStart: data.project.stationingStart,
      stationingEnd: data.project.stationingEnd,
      comment: data.project.comment,
    });
  await common.customerEmailInput.fill('example@gmailcom');
  await common.submitProject();

  const errorText = await common.emailErrorValidation();
  expect(errorText.trim()).toBe('Enter valid email');
  console.log(errorText);
});

test('Cancel button action', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  await loginPage.goto();
  await common.clickNewProject();
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects/create-project");
  await page.locator("button[aria-label='FormFooterCancelButton']").click();
  await page.reload();
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");
});

test('BackArrowBackIcon function', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  await loginPage.goto();
  await common.clickNewProject();
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects/create-project");
  await page.locator("svg[data-testid='ArrowBackIcon']").click();
  await page.reload();
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");

});

test("Wrong name project search", async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  await loginPage.goto();
  await common.searchProject("Wrong Project Name");
  await expect(page.getByText('No projects found')).toBeVisible();

});
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Login/loginPage');
const { Common } = require('../Modules/Common/common');

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
    name: 'Test Project',
    number: '123456789',
    startPlace: 'a',
    endPlace: 'b',
    stationingStart: '100',
    stationingEnd: '2000',
    comment: 'Test Project',
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

test('BackArrowBackIcon function valdiaion', async () => {
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

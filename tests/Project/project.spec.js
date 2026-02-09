const { test,expect } = require('@playwright/test');
const { LoginPage } = require('../../Utils/loginPage');
const { Common } = require('../../Utils/common');
const { data } = require('../../Utils/Data/Information');
let webContext;

test.beforeAll('Homepaeg to dashboard ', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  try {
    await loginPage.goto();
    //await page.locator('.MuiGrid-root').nth(1).isVisible();
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

test.only('Project info  ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(data.templateName.en13848);
  await common.submitProject();
  await common.searchProject(data.templateName.en13848);
  await expect(page.getByLabel(data.templateName.en13848).first()).toBeVisible();
  await common.enterIntoProject(data.templateName.en13848);
  await expect(page.getByRole('heading', { name: data.templateName.en13848 })).toBeVisible();
  const projectInfoPage = await expect(page.locator('button:has-text("PROJECT CONFIGURATION")')).toBeVisible();
  if(projectInfoPage) {
    console.log('Project Info visible - Test Passed');
  }
});
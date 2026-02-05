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

test('Project info  ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);

  await loginPage.goto();
  


});
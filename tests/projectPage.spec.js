const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Home/homePage');

let webContext

test.beforeAll('Homepaeg to dashboard @login @smoke', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
   try {
    await loginPage.goto();
   //await page.locator(".MuiGrid-root").nth(1).waitFor({ state: 'visible' });
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: 'login-failure.png', fullPage: true });
    console.error(' Login test failed:', error.message);
    throw error;
  }

  await context.storageState({path: "state.json"}); // session store at > state.json
   webContext = await browser.newContext({storageState: "state.json"}); // webcontext using that session 
});
test('store json ', async ({}) => {
 const page = await webContext.newPage(); // create page under the webContext session
 const loginPage = new LoginPage(page);
 await loginPage.goto();

});


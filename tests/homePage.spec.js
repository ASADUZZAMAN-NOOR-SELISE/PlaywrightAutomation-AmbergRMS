const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Home/homePage');

test('Homepaeg to dashboard @login @smoke', async ({ page }) => {
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
});

const { test } = require('@playwright/test');
const { LoginPage } = require('../../../Modules/Home/homePage');
const { Common } = require('../../../Modules/Common/common');
const { AdifIbericoProject } = require('../../../Modules/Project/ADIF/adifIbericoProject');

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

test('ADIF Iberico @PROJECT-CREATE ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);

  const common = new Common(page);
  const adifIberico = new AdifIbericoProject(page);

  await loginPage.goto();

  await common.clickNewProject();

  await common.generalInformation({
    name: 'ADIF Iberico',
    number: '123456789',
    startPlace: 'a',
    endPlace: 'b',
    stationingStart: '100',
    stationingEnd: '3000',
    comment: '', // your original test did not fill comment here
  });

  await common.templateSelection({
    lineSectionName: 'Line section 1',
    trackName: 'Track 1',
  });

  // ✅ Extracted ADIF Ibérico logic
  await adifIberico.applyIbericoTemplate({ pick: 'A' });

  // Customer (same as your flow)
  await common.customerInformation({
    name: 'Company name 1',
    street: 'a',
    town: 'b',
    postalCode: '1234',
    region: 'c',
    phone: '123456789',
    email: 'example@gmail.com',
  });

  // Keep your same “double selection” behavior if needed
  await page.locator('[id="mui-component-select-CustomerInfo.Country"]').click();
  await page.getByRole('option', { name: 'Afghanistan' }).click();
  await page.getByRole('combobox', { name: 'Afghanistan' }).click();
  await page.getByRole('option', { name: 'American Samoa' }).click();

  // Service provider (kept same way as your script)
  await page.locator('input[name="ServiceProviderInfo.Name"]').fill('Service Provider name');
  await page.locator('input[name="ServiceProviderInfo.Street"]').fill('a');
  await page.locator('input[name="ServiceProviderInfo.Town"]').fill('b');
  await page.locator('input[name="ServiceProviderInfo.PostalCode"]').fill('12345');
  await page.locator('input[name="ServiceProviderInfo.Region"]').fill('c');

  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Albania' }).click();

  await page.locator('input[name="ServiceProviderInfo.PhoneNumber"]').fill('123456789');
  await page.locator('input[name="ServiceProviderInfo.Email"]').fill('service@gmail.com');

  await common.submitCreateProject();
});

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
    comment: '',
  });

  await common.fillLineAndTrack({
    lineSectionName: 'Line section 1',
    trackName: 'Track 1',
  });

  // ✅ ADIF Ibérico template selection (matches your new AdifIbericoProject structure)
  await adifIberico.adifIbericoTemplateSelect('AdifIbRico1668Mm', 'A');

  await common.customerInformation({
    name: 'Company name 1',
    street: 'a',
    town: 'b',
    postalCode: '1234',
    region: 'c',
    country: 'American Samoa',
    phone: '123456789',
    email: 'example@gmail.com',
  });

  await common.fillServiceProviderInfo({
    name: 'Service Provider name',
    street: 'a',
    town: 'b',
    postalCode: '12345',
    region: 'c',
    phone: '123456789',
    email: 'service@gmail.com',
  });

  await common.submitProject();
});

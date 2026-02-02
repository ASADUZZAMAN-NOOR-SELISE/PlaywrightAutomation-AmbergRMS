const { test } = require('@playwright/test');
const { LoginPage } = require('../../../Modules/Home/homePage');
const { Common } = require('../../../Modules/Common/common');
const { STNProject } = require('../../../Modules/Project/STN/sTN');

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

test('Create STN Project @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const stn = new STNProject(page);

  await loginPage.goto();
  await common.clickNewProject();


  await common.generalInformation({
    name: 'STN Project',
    number: '123456789',
    startPlace: 'a',
    endPlace: 'b',
    stationingStart: '100',
    stationingEnd: '2000',
    comment: 'STN Default Project',
  });

  await common.fillLineAndTrack({
    lineSectionName: 'Line 1',
    trackName: 'Track1',
  });


  await stn.selectSTNTemplate();
  await stn.submit();
  await stn.expectTemplateOptionRequiredError();

  await stn.selectTemplateOption();


  await common.customerInformation({
    name: 'Customer name',
    street: 'a',
    town: 'b',
    postalCode: '12345',
    region: 'c',
    country: 'American Samoa',
    phone: '123456789',
    email: 'customer@gmail.com',
  });


  await common.fillServiceProviderInfo({
    name: 'Service Provider',
    street: 'a',
    town: 'b',
    postalCode: '12345',
    region: 'c',
    phone: '123456789',
    email: 'service@gmail.com',
  });

  await common.submitProject();
  await common.newProjectButton.waitFor({ state: 'visible' });
});

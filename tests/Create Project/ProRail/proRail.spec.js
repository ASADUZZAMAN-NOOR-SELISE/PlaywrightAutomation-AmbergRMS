const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../Modules/Login/loginPage');
const { Common } = require('../../../Utils/common');
const {ProRail} = require("../../../Modules/Project/Prorail/proRail");

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

test('Create Project ADIF Standard @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const proRail = new ProRail(page);

  await loginPage.goto();
  await common.clickNewProject();

  await common.generalInformation({
    name: 'ProRail Automation Project',
    number: '123456789',
    startPlace: 'A',
    endPlace: 'B',
    stationingStart: '100',
    stationingEnd: '2000',
    comment: 'General information about the project',
  });

  await proRail.selectProRail();
  await proRail.selectLineSection('Harlingen Haven - Leeuwarden');
  await proRail.submit();
  await proRail.expectTrackRequiredError();
  await proRail.selectTrack('w1125L-s621, 621');
  await proRail.selectTemplate('ProRail');


  await common.customerInformation({
    name: 'Customer 1',
    street: 'a',
    town: 'b',
    postalCode: '1212',
    region: 'a',
    country: 'American Samoa',
    phone: '123456789',
    email: 'example@gmail.com',
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
  // Search and verify project creation
  await common.searchProject('ProRail Automation Project');
  await common.enterIntoProject('ProRail Automation Project');
  await common.deleteInProjectTree();
  
});


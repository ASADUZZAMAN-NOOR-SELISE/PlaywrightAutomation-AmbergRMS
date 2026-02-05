const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../Utils/loginPage');
const { Common } = require('../../../Utils/common');
const {ProRail} = require("../ProRail/proRail");
const { data } = require('../../../Utils/Data/Information');

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

test('Create Project ADIF Standard @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const proRail = new ProRail(page);

  await loginPage.goto();
  await common.clickNewProject();

  await common.generalInformation({
    name: data.templateName.proRail,
    number: data.project.number,
    startPlace:data.project.startPlace,
    endPlace: data.project.endPlace,
    stationingStart: data.project.stationingStart,
    stationingEnd: data.project.stationingEnd,
    comment: data.project.comment,
  });

  await proRail.selectProRail();
  await proRail.selectLineSection('Harlingen Haven - Leeuwarden');
  await proRail.submit();
  await proRail.expectTrackRequiredError();
  await proRail.selectTrack('w1125L-s621, 621');
  await proRail.selectTemplate('ProRail');


  await common.customerInformation({
    name: data.customerData.name,
    street: data.customerData.street,
    town: data.customerData.town,
    postalCode: data.customerData.postalCode,
    region: data.customerData.region,
    country: data.customerData.country,
    phone: data.customerData.phone ,
    email: data.customerData.email,
  });


  await common.fillServiceProviderInfo({
    name: data.serviceProviderData.name,
    street: data.serviceProviderData.street,
    town: data.serviceProviderData.town,
    postalCode: data.serviceProviderData.postalCode,
    region: data.serviceProviderData.region,
    phone: data.serviceProviderData.phone,
    email: data.serviceProviderData.email,
  });

  await common.submitProject();
  await common.newProjectButton.waitFor({ state: 'visible' });
  // Search and verify project creation
  await common.searchProject(data.templateName.proRail);
  await common.enterIntoProject(data.templateName.proRail);
  await common.deleteInProjectTree();
  
});


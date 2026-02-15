const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../../Utils/loginPage';
import { Common } from '../../../Utils/common';
import { AdifMetricProject } from '../ADIF/adifMetricProject';
import { data } from '../../../Utils/Data/Information';

let webContext;

test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await loginPage.goto();
    await page.locator(".MuiGrid-root").nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await page.reload(); // Ensure the page is fully loaded after login
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test('ADIF Metrico @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const adifMetric = new AdifMetricProject(page);

  await loginPage.goto();
  await common.clickNewProject();
 await common.generalInformation({
    name: data.templateName.adifMetrico,
    number: data.project.number,
    startPlace:data.project.startPlace,
    endPlace: data.project.endPlace,
    stationingStart: data.project.stationingStart,
    stationingEnd: data.project.stationingEnd,
    comment: data.project.comment,
  });
  await common.fillLineAndTrack({
    lineSectionName: 'Line section 1',
    trackName: 'Track 1',
  });

  // ADIF Metric template selection
  // await adifMetric.selectMetricTemplate('AdifMTrico1000Mm');
  // await adifMetric.openTemplateOptionAndPickDefault();
  // await adifMetric.verifyMetricOptions();
  await adifMetric.applyMetricTemplate();
  await common.customerInformation({
    name: data.customerData.name,
    street: data.customerData.street,
    town: data.customerData.town,
    postalCode: data.customerData.postalCode,
    region: data.customerData.region,
    country: data.customerData.country,
    phone: data.customerData.phone,
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
  await common.searchProject(data.templateName.adifMetrico);
  await common.enterIntoProject(data.templateName.adifMetrico);
  await common.deleteInProjectTree();
  
});

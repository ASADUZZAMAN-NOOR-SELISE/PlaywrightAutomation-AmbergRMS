const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../../Modules/Login/loginPage');
const { Common } = require('../../../Utils/common');
const { AdifProject } = require('../../../Modules/Project/ADIF/adifProject');
const { data } = require('../../../Utils/Data/Information');

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

test("Template configuration validation", async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const adifProject = new AdifProject(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
    name: data.templateName.adifStanderd,
    number: data.project.number,
    startPlace:data.project.startPlace,
    endPlace: data.project.endPlace,
    stationingStart: data.project.stationingStart,
    stationingEnd: data.project.stationingEnd,
    comment: data.project.comment,
  });
  await adifProject.configurationTemplateDropdown.click();
  await page.getByRole('option', { name: 'AdifEstNdar1435Mm' }).click();
  await common.submitProject();
  const errorText = await page.locator("p").textContent();
  expect(errorText).toBe("Template option is required");
})

test('Create Project ADIF Standard @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const adifProject = new AdifProject(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.generalInformation({
    name: data.templateName.adifStanderd,
    number: data.project.number,
    startPlace:data.project.startPlace,
    endPlace: data.project.endPlace,
    stationingStart: data.project.stationingStart,
    stationingEnd: data.project.stationingEnd,
    comment: data.project.comment,
  });

  await common.fillLineAndTrack({ lineSectionName: 'Line section 1', trackName: 'Track 1' });
  await adifProject.adifTemplateSelect('AdifEstNdar1435Mm');
 
  //  Common Customer
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

  // Service provider 
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
  await common.searchProject(data.templateName.adifStanderd);
  await expect(page.getByLabel(data.templateName.adifStanderd).first()).toBeVisible();
  await common.enterIntoProject(data.templateName.adifStanderd);
  await common.deleteInProjectTree();
  
});



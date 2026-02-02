const { test } = require('@playwright/test');
const { LoginPage } = require('../../../Modules/Home/homePage');
import { Common } from '../../../Modules/Common/common';
import { AdifMetricProject } from '../../../Modules/Project/ADIF/adifMetricProject';

let webContext;

test.beforeAll('Homepage to dashboard', async ({ browser }) => {
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
    console.error('Login test failed:', error.message);
    throw error;
  }

  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('ADIF Metrico @PROJECT-CREATE', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);

  const common = new Common(page);
  const adifMetric = new AdifMetricProject(page);

  await loginPage.goto();

  await common.clickNewProject();

  await common.generalInformation({
    name: 'ADIF Metrico',
    number: '123456789',
    startPlace: 'a',
    endPlace: 'b',
    stationingStart: '100',
    stationingEnd: '2000',
    comment: 'comment',
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
    name: 'Company name 1',
    street: 'a',
    town: 'b',
    postalCode: '12345',
    region: 'c',
    country: 'American Samoa',
    phone: '123456789',
    email: 'example@gmail.com',
  });

  // Service Provider - uses Common's current method (selects Austria inside method)
  await common.fillServiceProviderInfo({
    name: 'Service Provider name',
    street: 'a',
    town: 'b',
    postalCode: '12345',
    region: 'c',
    phone: '123456789',
    email: 'service.provider@gmai.com',
  });

  await common.submitProject();
  await common.newProjectButton.waitFor({ state: 'visible' });
  
});

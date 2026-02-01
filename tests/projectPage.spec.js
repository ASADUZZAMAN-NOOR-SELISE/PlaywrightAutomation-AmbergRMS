const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Home/homePage');

let webContext

test.beforeAll('Homepaeg to dashboard ', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
   try {
    await loginPage.goto();
    await page.locator(".MuiGrid-root").nth(1).isVisible();
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

test('Create Project ADIF Standard @ADIF', async ({}) => {

  const page = await webContext.newPage(); // create page under the webContext session
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
  await page.getByRole('button', { name: 'New Project' }).click();
  await expect(page.getByRole('heading', { name: 'Create Project' })).toBeVisible();
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).dblclick();
  await page.getByRole('textbox', { name: 'NameInput' }).pressSequentially(" "+'ADIF Project Standard', { delay: 300 });
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Start Place' }).click();
  await page.getByRole('textbox', { name: 'Start Place' }).fill('A');
  await page.getByRole('textbox', { name: 'End Place' }).click();
  await page.getByRole('textbox', { name: 'End Place' }).fill('B');
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).fill('100');
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).fill('2000');
  await page.getByRole('radio', { name: 'Default' }).isChecked();
  await page.getByRole('textbox', { name: 'Name of Line Section' }).click();
  await page.getByRole('textbox', { name: 'Name of Line Section' }).fill('Line section 1');
  await page.getByRole('textbox', { name: 'Name of Track' }).click();
  await page.getByRole('textbox', { name: 'Name of Track' }).fill('Track 1');
  await page.getByRole('combobox', { name: 'Select configuration template' }).click();
  await page.getByRole('option', { name: 'AdifEstNdar1435Mm' }).click();
  await page.getByRole('combobox', { name: 'Select Template Option' }).click();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Generales' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea A' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea B' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea C' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea D' })).toBeVisible();
  await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea E' })).toBeVisible();

  await page.getByRole('option', { name: 'ADIF Estándar 1435 - Generales' }).click();
  await page.locator('[id="menu-ProjectInfo.TemplateOption"] > .MuiBackdrop-root').click();

  await page.locator('input[name="CustomerInfo.Name"]').click();
  await page.locator('input[name="CustomerInfo.Name"]').fill('Customer 1');
  await page.locator('input[name="CustomerInfo.Street"]').click();
  await page.locator('input[name="CustomerInfo.Street"]').fill('a');
  await page.locator('input[name="CustomerInfo.Town"]').click();
  await page.locator('input[name="CustomerInfo.Town"]').fill('b');
  await page.locator('input[name="CustomerInfo.PostalCode"]').click();
  await page.locator('input[name="CustomerInfo.PostalCode"]').fill('1212');
  await page.locator('input[name="CustomerInfo.Region"]').click();
  await page.locator('input[name="CustomerInfo.Region"]').fill('a');
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').click();
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').fill('123456789');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Search by Project Name' }).fill('ADIF Project Standard');
  await expect(page.getByLabel('ADIF Project').first()).toBeVisible();

});


test('test', async ({}) => {
  const page = await webContext.newPage(); // create page under the webContext session
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
  await page.getByRole('button', { name: 'New Project' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).press('CapsLock');
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'NameInput' }).pressSequentially(" "+'ADIF Iberico', { delay: 300 });
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Start Place' }).click();
  await page.getByRole('textbox', { name: 'Start Place' }).fill('a');
  await page.getByRole('textbox', { name: 'End Place' }).click();
  await page.getByRole('textbox', { name: 'End Place' }).fill('b');
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).fill('100');
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).fill('3000');
  await page.getByRole('textbox', { name: 'Name of Line Section' }).click();
  await page.getByRole('textbox', { name: 'Name of Line Section' }).fill('Line section 1');
  await page.getByRole('textbox', { name: 'Name of Track' }).click();
  await page.getByRole('textbox', { name: 'Name of Track' }).fill('Track 1');
  await page.getByRole('combobox', { name: 'Select configuration template' }).click();
  await page.getByRole('option', { name: 'AdifIbRico1668Mm' }).click();
  await page.getByRole('combobox', { name: 'Select Template Option' }).click();
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Generales');
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Tipo de línea A');
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Tipo de línea B');
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Tipo de línea C');
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Tipo de línea D');
  await expect(page.getByRole('listbox')).toContainText('ADIF Ibérico 1668 - Tipo de línea E');
  await page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea A' }).click();
  await page.locator('input[name="CustomerInfo.Name"]').click();
  await page.locator('input[name="CustomerInfo.Name"]').fill('Company name 1');
  await page.locator('input[name="CustomerInfo.Street"]').click();
  await page.locator('input[name="CustomerInfo.Street"]').fill('a');
  await page.locator('input[name="CustomerInfo.Town"]').click();
  await page.locator('input[name="CustomerInfo.Town"]').fill('b');
  await page.locator('input[name="CustomerInfo.PostalCode"]').click();
  await page.locator('input[name="CustomerInfo.PostalCode"]').fill('1234');
  await page.locator('input[name="CustomerInfo.Region"]').click();
  await page.locator('input[name="CustomerInfo.Region"]').fill('c');
  await page.locator('[id="mui-component-select-CustomerInfo.Country"]').click();
  await page.getByRole('option', { name: 'Afghanistan' }).click();
  await page.getByRole('combobox', { name: 'Afghanistan' }).click();
  await page.getByRole('option', { name: 'American Samoa' }).click();
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').click();
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').fill('123456789');
  await page.locator('input[name="CustomerInfo.Email"]').click();
  await page.locator('input[name="CustomerInfo.Email"]').fill('example@gmail.com');
  await page.locator('input[name="ServiceProviderInfo.Name"]').click();
  await page.locator('input[name="ServiceProviderInfo.Name"]').fill('Service Provider name');
  await page.locator('input[name="ServiceProviderInfo.Street"]').click();
  await page.locator('input[name="ServiceProviderInfo.Street"]').fill('a');
  await page.locator('input[name="ServiceProviderInfo.Town"]').click();
  await page.locator('input[name="ServiceProviderInfo.Town"]').fill('b');
  await page.locator('input[name="ServiceProviderInfo.PostalCode"]').click();
  await page.locator('input[name="ServiceProviderInfo.PostalCode"]').fill('12345');
  await page.locator('input[name="ServiceProviderInfo.Region"]').click();
  await page.locator('input[name="ServiceProviderInfo.Region"]').fill('c');
  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Albania' }).click();
  await page.locator('input[name="ServiceProviderInfo.PhoneNumber"]').click();
  await page.locator('input[name="ServiceProviderInfo.PhoneNumber"]').fill('123456789');
  await page.locator('input[name="ServiceProviderInfo.Email"]').click();
  await page.locator('input[name="ServiceProviderInfo.Email"]').fill('service@gmail.com');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).fill('ADIF Iberico');
  await expect(page.getByLabel('ADIF Iberico').first()).toBeVisible();
});


test('Metrico', async ({ }) => {
  const page = await webContext.newPage(); // create page under the webContext session
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
  await page.getByRole('button', { name: 'New Project' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.waitForTimeout(500);
  await page.getByRole('textbox', { name: 'NameInput' }).pressSequentially(" "+'ADIF Metrico', { delay: 300 });
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Start Place' }).click();
  await page.getByRole('textbox', { name: 'Start Place' }).fill('a');
  await page.getByRole('textbox', { name: 'End Place' }).click();
  await page.getByRole('textbox', { name: 'End Place' }).fill('b');
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).fill('100');
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).click();
  await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).fill('2000');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('comment');
  await page.getByRole('radio', { name: 'Default' }).check();
  await page.getByRole('textbox', { name: 'Name of Line Section' }).click();
  await page.getByRole('textbox', { name: 'Name of Line Section' }).fill('Line section 1');
  await page.getByRole('textbox', { name: 'Name of Track' }).click();
  await page.getByRole('textbox', { name: 'Name of Track' }).fill('Track 1');
  await page.getByRole('combobox', { name: 'Select configuration template' }).click();
  await page.getByRole('option', { name: 'AdifMTrico1000Mm' }).click();
  await page.getByRole('combobox', { name: 'Select Template Option' }).click();
  await page.getByRole('option', { name: 'ADIF Métrico 1000 - Default' }).click();
  await page.getByRole('combobox', { name: 'Select Template Option ADIF M' }).click();
  await expect(page.getByRole('listbox')).toContainText('ADIF Métrico 1000 - Default');
  await expect(page.getByRole('listbox')).toContainText('ADIF Métrico 1000 - Generales');
  await page.getByRole('option', { name: 'ADIF Métrico 1000 - Default' }).click();
  await page.locator('input[name="CustomerInfo.Name"]').click();
  await page.locator('input[name="CustomerInfo.Name"]').fill('Company name 1');
  await page.locator('input[name="CustomerInfo.Street"]').click();
  await page.locator('input[name="CustomerInfo.Street"]').fill('a');
  await page.locator('input[name="CustomerInfo.Town"]').click();
  await page.locator('input[name="CustomerInfo.Town"]').fill('b');
  await page.locator('input[name="CustomerInfo.PostalCode"]').click();
  await page.locator('input[name="CustomerInfo.PostalCode"]').fill('12345');
  await page.locator('input[name="CustomerInfo.Region"]').click();
  await page.locator('input[name="CustomerInfo.Region"]').fill('c');
  await page.locator('[id="mui-component-select-CustomerInfo.Country"]').click();
  await page.getByRole('option', { name: 'American Samoa' }).click();
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').click();
  await page.locator('input[name="CustomerInfo.PhoneNumber"]').fill('123456789');
  await page.locator('input[name="CustomerInfo.Email"]').click();
  await page.locator('input[name="CustomerInfo.Email"]').fill('example@gmail.com');
  await page.locator('input[name="ServiceProviderInfo.Name"]').click();
  await page.locator('input[name="ServiceProviderInfo.Name"]').fill('Service Provider name');
  await page.locator('input[name="ServiceProviderInfo.Street"]').click();
  await page.locator('input[name="ServiceProviderInfo.Street"]').fill('a');
  await page.locator('input[name="ServiceProviderInfo.Town"]').click();
  await page.locator('input[name="ServiceProviderInfo.Town"]').fill('b');
  await page.locator('input[name="ServiceProviderInfo.PostalCode"]').click();
  await page.locator('input[name="ServiceProviderInfo.PostalCode"]').fill('12345');
  await page.locator('input[name="ServiceProviderInfo.Region"]').click();
  await page.locator('input[name="ServiceProviderInfo.Region"]').fill('c');
  await page.getByLabel('', { exact: true }).click();
  await page.getByRole('option', { name: 'Albania' }).click();
  await page.locator('input[name="ServiceProviderInfo.PhoneNumber"]').click();
  await page.locator('input[name="ServiceProviderInfo.PhoneNumber"]').fill('123456789');
  await page.locator('input[name="ServiceProviderInfo.Email"]').click();
  await page.locator('input[name="ServiceProviderInfo.Email"]').fill('service.provider@gmai.com');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).click();
  await page.getByRole('textbox', { name: 'Search by Project Name' }).fill('ADIF Metrico');
  await expect(page.getByLabel('ADIF Metrico')).toBeVisible();
});


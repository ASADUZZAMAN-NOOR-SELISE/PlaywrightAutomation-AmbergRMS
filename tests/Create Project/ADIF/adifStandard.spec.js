// const { test, expect } = require('@playwright/test');
// const { LoginPage } = require('../../../Modules/Home/homePage');

// let webContext

// test.beforeAll('Homepaeg to dashboard ', async ({ browser }) => {
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const loginPage = new LoginPage(page);
//    try {
//     await loginPage.goto();
//     await page.locator(".MuiGrid-root").nth(1).isVisible();
//     await loginPage.verifyInitialState();
//     await loginPage.login();
//     await loginPage.logoutVisible();
//   } catch (error) {
//     await page.screenshot({ path: 'login-failure.png', fullPage: true });
//     console.error(' Login test failed:', error.message);
//     throw error;
//   }

//   await context.storageState({path: "state.json"}); // session store at > state.json
//    webContext = await browser.newContext({storageState: "state.json"}); // webcontext using that session 
// });

// test('Create Project ADIF Standard @PROJECT-CREATE', async ({}) => {

//   const page = await webContext.newPage(); // create page under the webContext session
//   const loginPage = new LoginPage(page);
//   await loginPage.goto();
//   await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
//   await page.getByRole('button', { name: 'New Project' }).click();
//   await expect(page.getByRole('heading', { name: 'Create Project' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'NameInput' }).click();
//   await page.getByRole('textbox', { name: 'NameInput' }).dblclick();
//   await page.getByRole('textbox', { name: 'NameInput' }).pressSequentially(" "+'ADIF Project Standard', { delay: 300 });
//   await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
//   await page.getByRole('textbox', { name: 'Start Place' }).click();
//   await page.getByRole('textbox', { name: 'Start Place' }).fill('A');
//   await page.getByRole('textbox', { name: 'End Place' }).click();
//   await page.getByRole('textbox', { name: 'End Place' }).fill('B');
//   await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).click();
//   await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).fill('100');
//   await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).click();
//   await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).fill('2000');
//   await page.getByRole('radio', { name: 'Default' }).isChecked();
//   await page.getByRole('textbox', { name: 'Name of Line Section' }).click();
//   await page.getByRole('textbox', { name: 'Name of Line Section' }).fill('Line section 1');
//   await page.getByRole('textbox', { name: 'Name of Track' }).click();
//   await page.getByRole('textbox', { name: 'Name of Track' }).fill('Track 1');
//   await page.getByRole('combobox', { name: 'Select configuration template' }).click();
//   await page.getByRole('option', { name: 'AdifEstNdar1435Mm' }).click();
//   await page.getByRole('combobox', { name: 'Select Template Option' }).click();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Generales' })).toBeVisible();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea A' })).toBeVisible();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea B' })).toBeVisible();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea C' })).toBeVisible();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea D' })).toBeVisible();
//   await expect(page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea E' })).toBeVisible();

//   await page.getByRole('option', { name: 'ADIF Estándar 1435 - Generales' }).click();
//   await page.locator('[id="menu-ProjectInfo.TemplateOption"] > .MuiBackdrop-root').click();

//   await page.locator('input[name="CustomerInfo.Name"]').click();
//   await page.locator('input[name="CustomerInfo.Name"]').fill('Customer 1');
//   await page.locator('input[name="CustomerInfo.Street"]').click();
//   await page.locator('input[name="CustomerInfo.Street"]').fill('a');
//   await page.locator('input[name="CustomerInfo.Town"]').click();
//   await page.locator('input[name="CustomerInfo.Town"]').fill('b');
//   await page.locator('input[name="CustomerInfo.PostalCode"]').click();
//   await page.locator('input[name="CustomerInfo.PostalCode"]').fill('1212');
//   await page.locator('input[name="CustomerInfo.Region"]').click();
//   await page.locator('input[name="CustomerInfo.Region"]').fill('a');
//   await page.locator('input[name="CustomerInfo.PhoneNumber"]').click();
//   await page.locator('input[name="CustomerInfo.PhoneNumber"]').fill('123456789');
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
//   await page.getByRole('textbox', { name: 'Search by Project Name' }).click();
//   // await page.getByRole('textbox', { name: 'Search by Project Name' }).press('CapsLock');
//   // await page.getByRole('textbox', { name: 'Search by Project Name' }).fill('ADIF Project Standard');
//   // await expect(page.getByLabel('ADIF Project').first()).toBeVisible();

// });


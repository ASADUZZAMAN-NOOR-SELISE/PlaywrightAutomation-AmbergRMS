// import { test, expect } from '@playwright/test';

// class CreateADIFProject {
//     constructor(page) {
//         this.page = page;
//     }


//   await page.goto('https://dev-amberg.seliselocal.com/login?go=/');
//   await page.getByRole('button', { name: 'Login submit button' }).click();
//   await expect(page.getByRole('button', { name: 'New Project' })).toBeVisible();
//   await page.getByRole('button', { name: 'New Project' }).click();
//   await expect(page.getByRole('heading', { name: 'Create Project' })).toBeVisible();
//   await page.getByRole('textbox', { name: 'NameInput' }).click();
//   await page.getByRole('textbox', { name: 'NameInput' }).fill('ADIF standred Automation ');
//   await page.getByRole('textbox', { name: 'NameInput' }).dblclick();
//   await page.getByRole('textbox', { name: 'NameInput' }).dblclick();
//   await page.getByRole('textbox', { name: 'NameInput' }).fill('ADIF Project 1');
//   await page.getByRole('textbox', { name: 'Number' }).click();
//   await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
//   await page.getByRole('textbox', { name: 'Start Place' }).click();
//   await page.getByRole('textbox', { name: 'Start Place' }).fill('A');
//   await page.getByRole('textbox', { name: 'End Place' }).click();
//   await page.getByRole('textbox', { name: 'End Place' }).fill('B');
//   await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).click();
//   await page.getByRole('spinbutton', { name: 'Stationing Start TextField' }).fill('100');
//   await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).click();
//   await page.getByRole('spinbutton', { name: 'Stationing End TextField' }).fill('2000');
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
//   await page.getByRole('textbox', { name: 'Search by Project Name' }).press('CapsLock');
//   await page.getByRole('textbox', { name: 'Search by Project Name' }).fill('ADIF Project 1');
//   await expect(page.getByLabel('ADIF Project')).toBeVisible();
// }


const { expect } = require('@playwright/test');

export class ProRail {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByRole('textbox', { name: 'NameInput' });
    this.proRailRadio = page.getByRole('radio', { name: 'ProRail' });
    this.lineSectionDropdown = page.getByRole('combobox', { name: 'Name of Line Section' });
    this.trackDropdown = page.getByRole('combobox', { name: 'Name of Track' });
    this.templateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.submitBtn = page.locator("button[type='submit']");
    this.errorText = page.getByRole('paragraph');
  }

  // async enterProjectName(name) {
  //   await this.nameInput.click();
  //   await this.nameInput.fill(name);
  // }

  async selectProRail() {
    await this.proRailRadio.check();
    await expect(this.proRailRadio).toBeChecked();
  }

  async selectLineSection(name) {
    await this.lineSectionDropdown.click();
    await this.page.getByRole('option', { name }).click();
  }

  async submit() {
    await this.submitBtn.click();
  }

  async expectTrackRequiredError() {
    await expect(this.errorText).toContainText('Name of Track is required');
  }

  async selectTrack(name) {
    await this.trackDropdown.click();
    await this.page.getByRole('option', { name }).click();
  }

  async selectTemplate(name) {
    await this.templateDropdown.click();
    await this.page.getByRole('option', { name }).click();
  }
}











// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('https://dev-amberg.seliselocal.com/login?go=/projects');
//   await page.getByRole('button', { name: 'Login submit button' }).click();
//   await page.getByRole('button', { name: 'New Project' }).click();
//   await page.getByRole('textbox', { name: 'NameInput' }).click();
//   await page.getByRole('textbox', { name: 'NameInput' }).fill('ProRail Automation Project');
//   await page.getByRole('radio', { name: 'ProRail' }).check();
//   await expect(page.getByRole('radio', { name: 'ProRail' })).toBeChecked();
//   await page.getByRole('combobox', { name: 'Name of Line Section' }).click();
//   await page.getByRole('option', { name: 'Harlingen Haven - Leeuwarden' }).click();
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
//   await expect(page.getByRole('paragraph')).toContainText('Name of Track is required');
//   await page.getByRole('combobox', { name: 'Name of Track' }).click();
//   await page.getByRole('option', { name: 'w1125L-s621,' }).click();
//   await page.getByRole('combobox', { name: 'Select configuration template' }).click();
//   await page.getByRole('option', { name: 'Prorail' }).click();
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
// });
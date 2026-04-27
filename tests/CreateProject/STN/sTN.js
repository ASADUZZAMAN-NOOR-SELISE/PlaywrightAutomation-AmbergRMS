const { expect } = require('@playwright/test');

export class STNProject {
  constructor(page) {
    this.page = page;
    this.templateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionSTN = page.getByRole('option', { name: 'SlovenskTechnickNorma' });
    this.submitButton = page.getByRole('button', { name: 'Custom Submit Button' });
    this.errorText = page.getByRole('paragraph');
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    this.templateOptionValue = page.getByRole('option', { name: 'STN - AL, IL, IAL' });
    this.backdrop = page.locator('[id="menu-ProjectInfo.TemplateOption"] > .MuiBackdrop-root');
  }

  async selectSTNTemplate() {
    await this.templateDropdown.click();
    await this.templateOptionSTN.click();
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectTemplateOptionRequiredError() {
    await expect(this.errorText).toContainText('Template option is required');
  }

  async selectTemplateOption() {
    await this.templateOptionDropdown.click();
    await this.templateOptionValue.click();
  }
}



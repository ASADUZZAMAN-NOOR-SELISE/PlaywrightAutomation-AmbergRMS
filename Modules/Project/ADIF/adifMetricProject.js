import { expect } from '@playwright/test';

export class AdifMetricProject {
  constructor(page) {
    this.page = page;
    this.configurationTemplateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    this.metricDefaultOption = page.getByRole('option', { name: 'ADIF Métrico 1000 - Default' });
    this.metricGeneralOption = page.getByRole('option', { name: 'ADIF Métrico 1000 - Generales' });
    // sometimes exists (your earlier script)
    this.templateOptionDropdownMetric = page.getByRole('combobox', { name: 'Select Template Option ADIF M' });
    this.listbox = page.getByRole('listbox');
  }

  async applyMetricTemplate(configTemplateValue = 'AdifMTrico1000Mm') {
    // select template
    await this.configurationTemplateDropdown.click();
    await this.page.getByRole('option', { name: configTemplateValue }).click();
    // open template options
    await this.templateOptionDropdown.click();
    // verify options exist
    await expect(this.listbox).toContainText('ADIF Métrico 1000 - Default');
    await expect(this.listbox).toContainText('ADIF Métrico 1000 - Generales');
    // pick default
    await expect(this.metricDefaultOption).toBeVisible();
    await this.metricDefaultOption.click();
    // if the extra dropdown exists and your UI requires it
    if (await this.templateOptionDropdownMetric.count()) {
      await this.templateOptionDropdownMetric.click();
      await expect(this.listbox).toContainText('ADIF Métrico 1000 - Default');
      await expect(this.listbox).toContainText('ADIF Métrico 1000 - Generales');
      await this.metricDefaultOption.click();
    }
  }
}

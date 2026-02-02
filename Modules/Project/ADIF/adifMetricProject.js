import { expect } from '@playwright/test';

export class AdifMetricProject {
  constructor(page) {
    this.page = page;
    this.configurationTemplateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    this.metricDefaultOption = page.getByRole('option', { name: 'ADIF Métrico 1000 - Default' });
    this.metricGeneralOption = page.getByRole('option', { name: 'ADIF Métrico 1000 - Generales' });
    this.templateOptionDropdownMetric = page.getByRole('combobox', { name: 'Select Template Option ADIF M' });
    this.listbox = page.getByRole('listbox');
  }

  async applyMetricTemplate(configTemplateValue = 'AdifMTrico1000Mm') {
    await this.configurationTemplateDropdown.click();
    await this.page.getByRole('option', { name: configTemplateValue }).click();
    await this.templateOptionDropdown.click();
    await expect(this.listbox).toContainText('ADIF Métrico 1000 - Default');
    await expect(this.listbox).toContainText('ADIF Métrico 1000 - Generales');
    await expect(this.metricDefaultOption).toBeVisible();
    await this.metricDefaultOption.click();
    if (await this.templateOptionDropdownMetric.count()) {
      await this.templateOptionDropdownMetric.click();
      await expect(this.listbox).toContainText('ADIF Métrico 1000 - Default');
      await expect(this.listbox).toContainText('ADIF Métrico 1000 - Generales');
      await this.metricDefaultOption.click();
    }
  }
}

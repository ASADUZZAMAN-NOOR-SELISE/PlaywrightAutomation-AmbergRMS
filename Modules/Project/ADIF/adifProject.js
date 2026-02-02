
import { expect } from '@playwright/test';

export class AdifProject {
  constructor(page) {
    this.page = page;
    this.configurationTemplateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    
    this.adifGeneral = page.getByRole('option', { name: 'ADIF Estándar 1435 - Generales' });
    this.adifA = page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea A' });
    this.adifB = page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea B' });
    this.adifC = page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea C' });
    this.adifD = page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea D' });
    this.adifE = page.getByRole('option', { name: 'ADIF Estándar 1435 - Tipo de línea E' });
  }

  async adifTemplateSelect(configTemplateValue = 'AdifEstNdar1435Mm') {
    await this.configurationTemplateDropdown.click();
    await this.page.getByRole('option', { name: configTemplateValue }).click();
    await this.templateOptionDropdown.click();
    await expect(this.adifGeneral).toBeVisible();
    await expect(this.adifA).toBeVisible();
    await expect(this.adifB).toBeVisible();
    await expect(this.adifC).toBeVisible();
    await expect(this.adifD).toBeVisible();
    await expect(this.adifE).toBeVisible();
    await this.adifGeneral.click();
  }
}

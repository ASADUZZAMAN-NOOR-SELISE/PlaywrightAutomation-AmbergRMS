import { expect } from '@playwright/test';

export class AdifIbericoProject {
  constructor(page) {
    this.page = page;

    this.configurationTemplateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    this.listbox = page.getByRole('listbox');

    // Configuration template option
    this.ibericoConfigOption = page.getByRole('option', { name: 'AdifIbRico1668Mm' });

    // Template options in listbox
    this.general = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Generales' });
    this.lineA = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea A' });
    this.lineB = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea B' });
    this.lineC = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea C' });
    this.lineD = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea D' });
    this.lineE = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea E' });
  }

  /**
   * Select ADIF Ibérico configuration template: AdifIbRico1668Mm
   */
  async selectConfigurationTemplate() {
    await this.configurationTemplateDropdown.click();
    await this.ibericoConfigOption.click();
  }

  /**
   * Open Template Option dropdown and verify expected Ibérico options exist
   */
  async verifyTemplateOptions() {
    await this.templateOptionDropdown.click();

    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Generales');
    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Tipo de línea A');
    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Tipo de línea B');
    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Tipo de línea C');
    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Tipo de línea D');
    await expect(this.listbox).toContainText('ADIF Ibérico 1668 - Tipo de línea E');
  }

  /**
   * Pick a specific Ibérico template option.
   * Allowed values: 'Generales', 'A', 'B', 'C', 'D', 'E'
   */
  async selectTemplateOption(option = 'A') {
    const map = {
      Generales: this.general,
      A: this.lineA,
      B: this.lineB,
      C: this.lineC,
      D: this.lineD,
      E: this.lineE,
    };

    const locator = map[option];
    if (!locator) {
      throw new Error(`Invalid Ibérico template option: "${option}". Use Generales/A/B/C/D/E`);
    }

    // Ensure dropdown open; safe to call again
    await this.templateOptionDropdown.click();
    await locator.click();
  }

  /**
   * Full flow convenience method:
   * - select configuration template
   * - verify options
   * - select desired option
   */
  async applyIbericoTemplate({ pick = 'A' } = {}) {
    await this.selectConfigurationTemplate();
    await this.verifyTemplateOptions();
    await this.selectTemplateOption(pick);
  }
}

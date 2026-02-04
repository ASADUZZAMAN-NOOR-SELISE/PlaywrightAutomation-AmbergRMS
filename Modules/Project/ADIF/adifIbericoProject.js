import { expect } from '@playwright/test';

export class AdifIbericoProject {
  constructor(page) {
    this.page = page;
    this.configurationTemplateDropdown = page.getByRole('combobox', { name: 'Select configuration template' });
    this.templateOptionDropdown = page.getByRole('combobox', { name: 'Select Template Option' });
    this.ibericoGeneral = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Generales' });
    this.ibericoA = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea A' });
    this.ibericoB = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea B' });
    this.ibericoC = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea C' });
    this.ibericoD = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea D' });
    this.ibericoE = page.getByRole('option', { name: 'ADIF Ibérico 1668 - Tipo de línea E' });
  }

  async adifIbericoTemplateSelect(configTemplateValue = 'AdifIbRico1668Mm', pick = 'A') {
    await this.configurationTemplateDropdown.click();
    await this.page.getByRole('option', { name: configTemplateValue }).click();
    await this.templateOptionDropdown.click();
    await expect(this.ibericoGeneral).toBeVisible();
    await expect(this.ibericoA).toBeVisible();
    await expect(this.ibericoB).toBeVisible();
    await expect(this.ibericoC).toBeVisible();
    await expect(this.ibericoD).toBeVisible();
    await expect(this.ibericoE).toBeVisible();

    // pick which option to click
    if (pick === 'Generales') await this.ibericoGeneral.click();
    else if (pick === 'A') await this.ibericoA.click();
    else if (pick === 'B') await this.ibericoB.click();
    else if (pick === 'C') await this.ibericoC.click();
    else if (pick === 'D') await this.ibericoD.click();
    else if (pick === 'E') await this.ibericoE.click();
    else throw new Error(`Invalid pick: "${pick}". Use Generales/A/B/C/D/E`);
  }
}

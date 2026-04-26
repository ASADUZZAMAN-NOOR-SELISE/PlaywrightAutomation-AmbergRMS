const { expect } = require('@playwright/test');

export class ChartPage {
  constructor(page) {
    this.page = page;
    this.filterInput = page.getByRole('combobox', { name: 'Filter' });
    this.filterOption = (option) => page.getByRole('option', { name: option });
  }

  async applyFilter(filterName) {
    await this.filterInput.click();
    await this.filterOption(filterName).click();
  }
}
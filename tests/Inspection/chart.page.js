const { expect } = require('@playwright/test');

export class ChartPage {
  constructor(page) {
    this.page = page;
    this.filterInput = page.getByRole('combobox', { name: 'Filter' });
    this.filterOption = (option) => page.getByRole('option', { name: option });
    this.searchByProjectNameInput = page.getByRole('textbox', { name: 'Search by Project Name' });
  }

  async applyFilter(filterName) {
    await this.filterInput.click();
    await this.filterOption(filterName).click();
  }

  async searchProject(projectName) {
    await this.searchByProjectNameInput.click();
    await this.searchByProjectNameInput.pressSequentially(projectName, { delay: 300 });
  }

  // click to enter into project > it takes project tree page
  async enterIntoProject(projectName) {
    const row = this.page.getByLabel(projectName).first();
    await row.isVisible();
  await row.click();
  }
} 
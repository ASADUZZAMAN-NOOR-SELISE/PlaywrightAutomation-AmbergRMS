import { expect } from '@playwright/test';
const {projectData} = require('./project.data');

export class Project {
  constructor(page) {
    this.page = page;

    // Project info
    this.name = page.getByRole('textbox', { name: 'Name' });
    this.number = page.getByRole('textbox', { name: 'Number' });
    this.startPlace = page.getByRole('textbox', { name: 'Start Place' });
    this.endPlace = page.getByRole('textbox', { name: 'End Place' });
    this.comment = page.getByRole('textbox', { name: 'Comment' });

    // Range
    this.startLocalization = page.getByRole('spinbutton', { name: 'Start Localization [m]' });
    this.endLocalization = page.getByRole('spinbutton', { name: 'End Localization [m]' });

    // Customer info
    this.company = page.getByRole('textbox', { name: 'Company' });
    this.street = page.getByRole('textbox', { name: 'Street' });
    this.town = page.getByRole('textbox', { name: 'Town' });
    this.region = page.getByRole('textbox', { name: 'Region' });
    this.postalCode = page.getByRole('textbox', { name: 'Postal Code' });
    this.countryDropdown = page.getByLabel('', { exact: true });
    this.telephone = page.getByRole('textbox', { name: 'Telephone' });
    this.email = page.getByRole('textbox', { name: 'Email' });
    this.website = page.getByRole('textbox', { name: 'Website' });
    this.editAlert = page.getByRole('alert').first();
    
    // Actions
    this.submitBtn = page.getByRole('button', { name: 'Custom Submit Button' });
    
  }

  async goto() {
    await this.page.goto('https://dev-amberg.seliselocal.com/projects/');
  }

  async fillProjectInfo() {
    //await expect(this.name).toHaveValue(projectData.project.name);
    await this.number.fill(projectData.project.number);
    await this.startPlace.fill(projectData.project.startPlace);
    await this.endPlace.fill(projectData.project.endPlace);
    await this.comment.fill(projectData.project.comment);
  }

  async fillRange() {
    
    await this.startLocalization.fill(projectData.project.stationingStart);
    await this.endLocalization.fill(projectData.project.stationingEnd);
  }

  async fillCustomerInfo() {
    
    await this.company.fill(projectData.customerData.name);
    await this.street.fill(projectData.customerData.street);
    await this.town.fill(projectData.customerData.town);
    await this.region.fill(projectData.customerData.region);
    await this.postalCode.fill(projectData.customerData.postalCode);
    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: projectData.customerData.country }).click();
    await this.telephone.fill(projectData.customerData.phone);
    await this.email.fill(projectData.customerData.email);
    await this.website.fill(projectData.customerData.website);
  }

  async submit() {
    await this.submitBtn.isVisible();
    await this.submitBtn.click();
  }

  async expectSuccess() {
    await expect(this.editAlert).toContainText('Project edited successfully');
  }
}

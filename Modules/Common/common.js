import { expect } from '@playwright/test';

export class Common {
  constructor(page) {
    this.page = page;

    this.newProjectButton = page.getByRole('button', { name: 'New Project' });
    this.createProjectHeading = page.getByRole('heading', { name: 'Create Project' });
    this.nameInput = page.getByRole('textbox', { name: 'NameInput' });
    this.numberInput = page.getByRole('textbox', { name: 'Number' });
    this.startPlaceInput = page.getByRole('textbox', { name: 'Start Place' });
    this.endPlaceInput = page.getByRole('textbox', { name: 'End Place' });
    this.stationingStartInput = page.getByRole('spinbutton', { name: 'Stationing Start TextField' });
    this.stationingEndInput = page.getByRole('spinbutton', { name: 'Stationing End TextField' });
    this.commentInput = page.getByRole('textbox', { name: 'Comment' });
    this.lineSectionNameInput = page.getByRole('textbox', { name: 'Name of Line Section' });
    this.trackNameInput = page.getByRole('textbox', { name: 'Name of Track' });
    // Customer
    this.customerNameInput = page.locator('input[name="CustomerInfo.Name"]');
    this.customerStreetInput = page.locator('input[name="CustomerInfo.Street"]');
    this.customerTownInput = page.locator('input[name="CustomerInfo.Town"]');
    this.customerPostalCodeInput = page.locator('input[name="CustomerInfo.PostalCode"]');
    this.customerRegionInput = page.locator('input[name="CustomerInfo.Region"]');
    this.customerCountryDropdown = page.locator('[id="mui-component-select-CustomerInfo.Country"]');
    this.customerPhoneInput = page.locator('input[name="CustomerInfo.PhoneNumber"]');
    this.customerEmailInput = page.locator('input[name="CustomerInfo.Email"]');
    // Service Provider
    this.serviceProviderNameInput = page.locator('input[name="ServiceProviderInfo.Name"]');
    this.serviceProviderStreetInput = page.locator('input[name="ServiceProviderInfo.Street"]');
    this.serviceProviderTownInput = page.locator('input[name="ServiceProviderInfo.Town"]');
    this.serviceProviderPostalCodeInput = page.locator('input[name="ServiceProviderInfo.PostalCode"]');
    this.serviceProviderRegionInput = page.locator('input[name="ServiceProviderInfo.Region"]');
    this.serviceCountryDropdown = page.getByLabel('', { exact: true });
    this.serviceProviderPhoneInput = page.locator('input[name="ServiceProviderInfo.PhoneNumber"]');
    this.serviceProviderEmailInput = page.locator('input[name="ServiceProviderInfo.Email"]');
    //country menu
    this.serviceProviderCountryBackdrop = page.locator('[id="menu-ServiceProviderInfo.Country"] > .MuiBackdrop-root');
    this.submitButton = page.getByRole('button', { name: 'Custom Submit Button' });
    this.searchByProjectNameInput = page.getByRole('textbox', { name: 'Search by Project Name' });
  }

  async clickNewProject() {
    await expect(this.newProjectButton).toBeVisible();
    await this.newProjectButton.click();
    await expect(this.createProjectHeading).toBeVisible();
  }

  async generalInformation(data) {
    await this.nameInput.click();
    await this.nameInput.fill('');
    await this.nameInput.pressSequentially(" "+ data.name, { delay: 300 });

    await this.numberInput.fill(data.number);
    await this.startPlaceInput.fill(data.startPlace);
    await this.endPlaceInput.fill(data.endPlace);
    await this.stationingStartInput.fill(data.stationingStart);
    await this.stationingEndInput.fill(data.stationingEnd);

    await this.commentInput.fill(data.comment);
  }

  async fillLineAndTrack({ lineSectionName, trackName }) {
    await this.lineSectionNameInput.fill(lineSectionName);
    await this.trackNameInput.fill(trackName);
  }

  async customerInformation(data) {
    await this.customerNameInput.fill(data.name);
    await this.customerStreetInput.fill(data.street);
    await this.customerTownInput.fill(data.town);
    await this.customerPostalCodeInput.fill(data.postalCode);
    await this.customerRegionInput.fill(data.region);

    await this.customerCountryDropdown.click();
    await this.page.getByRole('option', { name: data.country }).click();

    await this.customerPhoneInput.fill(data.phone);
    await this.customerEmailInput.fill(data.email);
  }

  async fillServiceProviderInfo(data) {
    await this.serviceProviderNameInput.fill(data.name);
    await this.serviceProviderStreetInput.fill(data.street);
    await this.serviceProviderTownInput.fill(data.town);
    await this.serviceProviderPostalCodeInput.fill(data.postalCode);
    await this.serviceProviderRegionInput.fill(data.region);
    // Your original test clicks an empty-label control then closes the menu via backdrop.
    // Keeping same behaviour.
    await this.serviceCountryDropdown.click();
    await this.page.getByRole('option', { name: 'Austria' }).click();
    //await this.serviceProviderCountryBackdrop.click();
    await this.serviceProviderPhoneInput.fill(data.phone);
    await this.serviceProviderEmailInput.fill(data.email);
  }
 // add comment 
  async submitProject() {
    await expect(this.submitButton).toBeEnabled();
    await this.submitButton.click();
  }
}
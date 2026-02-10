const{test, expect} = require('@playwright/test');
const{projecTreetData} = require('./projectTree.data');

export class ProjectTreePage {
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

    //line section
    this.lineSectionTab = page.locator("button[aria-label='Add Line Section']");
    this.lineSectionModal = page.locator("div form[aria-label='form']");
    this.lineSectionRadioBtn = page.locator("form [role='radiogroup'] label");
    this.nameField = page.getByRole('textbox', { name: 'NameInput' });
    this.numberField = page.getByRole('textbox', { name: 'Number' });
    this.startPlaceName = page.getByRole('textbox', { name: 'Start Place' });
    this.endPlaceName = page.getByRole('textbox', { name: 'End Place' });
    this.commentField = page.locator("div textarea[name='Comment']");
    this.startLocalization = page.locator('[name="Start.Stationing"]');
    this.endLocalization = page.locator('[name="End.Stationing"]');
    this.cancelBtn = page.locator('button:has-text("CANCEL")');
    this.submitLineSectionBtn = page.locator("button[type='submit']");
    this.clearIcon = page.locator("button[type='button']");
    this.cancelModal = page.locator("div[role='dialog']");
    this.modalConfirmBtn = page.locator("button[aria-label='confirm']");

    //Track under line section
    
  }

  async goto() {
    await this.page.goto('https://dev-amberg.seliselocal.com/projects/');
  }

  async fillProjectInfo() {
    await this.number.fill(projecTreetData.project.number);
    await this.startPlace.fill(projecTreetData.project.startPlace);
    await this.endPlace.fill(projecTreetData.project.endPlace);
    await this.comment.fill(projecTreetData.project.comment);
  }

  async fillRange() {
    
    await this.startLocalization.fill(projecTreetData.project.stationingStart);
    await this.endLocalization.fill(projecTreetData.project.stationingEnd);
  }

  async fillCustomerInfo() {
    

    await this.company.fill(projecTreetData.customerData.name);
    await this.street.fill(projecTreetData.customerData.street);
    await this.town.fill(projecTreetData.customerData.town);
    await this.region.fill(projecTreetData.customerData.region);
    await this.postalCode.fill(projecTreetData.customerData.postalCode);

    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: projecTreetData.customerData.country }).click();

    await this.telephone.fill(projecTreetData.customerData.phone);
    await this.email.fill(projecTreetData.customerData.email);
    await this.website.fill(projecTreetData.customerData.website);
  }

  async submit() {
    await this.submitBtn.isVisible();
    await this.submitBtn.click();
  }

  async expectSuccess() {
    await expect(this.editAlert).toContainText('Project edited successfully');
  }

  async addLine(){
    await this.lineSectionTab.click();
    await this.lineSectionModal.isVisible();
    await this.lineSectionRadioBtn.nth(0).click();
    await this.nameField.fill('Line section 1');
    await this.numberField.fill('123456789');
    await this.startPlaceName.fill('a');
    await this.endPlaceName.fill('b');
    await this.commentField.fill('General information about the line section');
    await this.startLocalization.fill('100');
    await this.endLocalization.fill('3000');
    await this.submitLineSectionBtn.isVisible();
    
  }

  async clearLine(){
    await this.lineSectionTab.click();
    await this.lineSectionModal.isVisible();
    await this.lineSectionRadioBtn.nth(0).click();
    await this.nameField.fill('Line section 1');
    await this.numberField.fill('123456789');
    await this.startPlaceName.fill('a');
    await this.endPlaceName.fill('b');
    await this.commentField.fill('General information about the line section');
    await this.startLocalization.fill('100');
    await this.endLocalization.fill('3000');
    await this.clearIcon.click();

  }
}

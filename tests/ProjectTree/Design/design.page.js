const { expect } = require('@playwright/test');

export class DesignPage {
  constructor(page) {
    this.page = page;
    this.addDesignBtn = page.locator(".project-tree-design").getByText("Add Design");
    this.designDrawer = page.getByTestId("add-design-section-drawer-test-id");
    this.design = page.getByTestId('design-tree-testid');
    
    this.nameInput = page.getByRole("textbox", { name: "name" });
    this.commentInput = page.getByRole("textbox", { name: "Comment" });
    this.calendarIcon = page.getByTestId("CalendarIcon");
    this.nextMonthBtn = page.getByTestId("ArrowRightIcon");
    this.nameError = page.locator("p");

    //button first modal 
    this.submitBtn = page.getByRole('button', { name: 'Custom Submit Button' });
    this.cancelBtn = page.getByRole('button', { name: 'Cancel' });
    this.crossBtn  = page.getByTestId('ClearIcon');
    this.editBtn = page.getByTestId("EditIcon");
    this.deleteBtn = page.getByTestId('DeleteIcon')


    // button in last confirm modal 
    this.modalCrossBtn = page.locator("button[aria-label='Close'] svg");
    this.modalConfirmBtn = page.getByRole('button', { name: /confirm/i });
    this.modalCancelBtn = page.getByRole('button', { name: 'Cancel' });

    //speed locator
    this.speed = page.getByTestId('design-tree-testid-child-0');
    this.speedDrawer = page.getByTestId("edit-speed-section-drawer-test-id");

    //bar edit icon
    this.barEditIcon = page.getByTestId("custom-side-bar").getByTestId("EditIcon");

  }

  async clickAddDesign() {
    await expect(this.addDesignBtn).toBeVisible();
    await this.addDesignBtn.click();
    await expect(this.designDrawer).toBeVisible();
  }

  async submitEmptyForm() {
    await this.submitBtn.click();
  }

  async verifyNameRequired() {
    await expect(this.nameError).toHaveText("Name is required");
  }

  async fillName(name) {
    await this.nameInput.fill(name);
  }

  async openCalendar() {
    await this.calendarIcon.click();
  }

  async goToNextMonth() {
    await this.nextMonthBtn.click();
  }

  async selectDate(day) {
    await this.page.locator("div[role='row'] button").filter({ hasText: day.toString()}).first().click();
  }

  async fillComment(comment) {
    await this.commentInput.fill(comment);
  }

  async submitDesign() {
    await this.submitBtn.click();
  }

  async verifyDesignCreated(name, comment, date) {

    await expect(this.page.getByTestId('design-tree-testid')).toBeVisible();
    await this.page.getByTestId('design-tree-testid').getByText(name).click();
    const sidebar = this.page.getByTestId("custom-side-bar");
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText(name, { exact: true })).toBeVisible();
    await expect(sidebar.getByText(comment, { exact: true })).toBeVisible();
    //await expect(sidebar.getByText(date, { exact: true })).toBeVisible();
  }
  
  async designClick(name){
    await this.design.getByText(name).click();
  }

  async speedClick(){
    await this.speed.waitFor({ state: 'visible' });
    await expect(this.speed).toBeEnabled();
    await this.speed.getByText("Speed").click();
  }

  async clickEditIcon(){
    await this.barEditIcon.waitFor({ state: 'visible' });
    await expect(this.barEditIcon).toBeEnabled();
    await this.barEditIcon.click({force: true});
  }

  async clickCrossBtn(){
    await expect(this.crossBtn.first()).toBeVisible();
    await this.crossBtn.first().click();
  }

  async clickCancelBtn(){
    await expect(this.cancelBtn.first()).toBeVisible();
    await this.cancelBtn.first().click();
  }
}
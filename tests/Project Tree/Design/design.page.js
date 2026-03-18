const { expect } = require('@playwright/test');

export class DesignPage {
  constructor(page) {
    this.page = page;
    this.addDesignBtn = page.locator(".project-tree-design").getByText("Add Design");
    this.designDrawer = page.getByTestId("add-design-section-drawer-test-id");
    
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
    await expect(sidebar.getByText(date, { exact: true })).toBeVisible();
  }
}
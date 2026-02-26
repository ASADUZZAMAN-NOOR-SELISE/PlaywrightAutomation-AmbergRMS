import { expect } from "@playwright/test";

class CTMPage {
  constructor(page) {
    this.page = page;

    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.ctmMenuItem = page.getByRole("menuitem", {
      name: "Configuration Template Manager",
    });
    this.heading = page.getByRole("heading", {
      name: "Configuration Template Manager",
    });
    this.importButton = page.getByRole("button", { name: "Import" });
    this.newTemplateButton = page.getByRole("button", {
      name: "newTemplateButton",
    });
    this.dialog = page.getByRole("dialog");
    this.dialogHeading = this.dialog.getByRole("heading");
    this.dialogInput1 = page.getByRole("textbox", {
      name: "TemplateNameTextField",
    });
    this.dialogInput2 = page.getByRole("combobox", { name: "Select Template" });

    this.dialogInputOption = page.getByRole("option", {
      name: "EN-13848",
      exact: true,
    });
    this.dialogConfirmButton = page.getByRole("button", {
      name: "ConfirmButton",
    });
    this.alert = page.getByRole("alert");
  }

  async navigateCTM() {
    await this.settingsButton.click();
    await expect(this.ctmMenuItem).toBeVisible();
    await expect(this.ctmMenuItem).toHaveText("Configuration Template Manager");
    await this.ctmMenuItem.click();
    await expect(this.heading).toHaveText("Configuration Template Manager");
    await expect(this.importButton).toBeVisible();
    await expect(this.importButton).toHaveText("IMPORT");
  }

  async newTemplate() {
    await expect(this.newTemplateButton).toBeVisible();
    await expect(this.newTemplateButton).toHaveText("New Template");
    await this.newTemplateButton.click();
    await expect(this.dialog).toBeVisible();
    await expect(this.dialogHeading).toHaveText("Create Template");
    await expect(this.dialogInput1).toBeVisible();
    await this.dialogInput1.fill("Test 4");
    await expect(this.dialogInput2).toBeVisible();
    await this.dialogInput2.click();
    await this.dialogInputOption.click();
    await this.dialogConfirmButton.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("New template added successfully");
  }
}

export { CTMPage };

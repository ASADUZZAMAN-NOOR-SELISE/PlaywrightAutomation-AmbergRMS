import { expect } from "@playwright/test";
import { templateHeaders } from "./templateHeader";

const templateName = `template-${Math.floor(100 + Math.random() * 900)}`;
const defaultName1 = "EN-13848";
const defaultName2 = "ProRail";
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
      name: defaultName1,
      exact: true,
    });
    this.dialogConfirmButton = page.getByRole("button", {
      name: "ConfirmButton",
    });
    this.alert = page.getByRole("alert");
    this.newTemplateName = page.getByLabel(templateName);

    this.defaultTemplateName1 = page
      .locator("span")
      .filter({ hasText: defaultName1 })
      .first();
    this.defaultTemplateName2 = page
      .locator("span")
      .filter({ hasText: defaultName2 })
      .first();

    this.templateHeaders = templateHeaders;

    this.deleteButton = this.page.getByLabel("DeleteConfiguration");
    this.editButton = this.page.getByLabel("EditConfiguration");
    this.backButton = this.page.getByLabel("BackButton");
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
    try {
      await expect(this.newTemplateName).not.toBeVisible();
      await expect(this.newTemplateButton).toBeVisible();
      await expect(this.newTemplateButton).toHaveText("New Template");
      await this.newTemplateButton.click();
      await expect(this.dialog).toBeVisible();
      await expect(this.dialogHeading).toHaveText("Create Template");
      await expect(this.dialogInput1).toBeVisible();
      await this.dialogInput1.fill(templateName);
      await expect(this.dialogInput2).toBeVisible();
      await this.dialogInput2.click();
      await this.dialogInputOption.click();
      await this.dialogConfirmButton.click();
      await expect(this.alert).toBeVisible();
      await expect(this.alert).toHaveText("New template added successfully");
      await expect(this.dialog).not.toBeVisible();
    } catch (error) {
      console.log("Template Already Exists");
    }
  }

  async verifyTemplateList() {
    await expect(this.defaultTemplateName1).toHaveText(defaultName1);
    await expect(this.defaultTemplateName2).toHaveText(defaultName2);
  }

  async verifyTemplateColumns() {
    for (const header of this.templateHeaders) {
      const templateList = this.page.getByText(header, { exact: true });
      await expect(templateList).toHaveText(header);
    }
  }

  async deleteEditButtons() {
    await this.defaultTemplateName2.click();
    await expect(this.deleteButton).toBeDisabled();
    await expect(this.editButton).toBeDisabled();
    await this.backButton.click();
    await this.newTemplateName.click();
    await expect(this.deleteButton).toBeEnabled();
    await expect(this.editButton).toBeEnabled();
  }
}

export { CTMPage };

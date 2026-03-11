import { expect } from "@playwright/test";
import { templateOptions } from "./templateOptions";

const templateName = `template-${Math.floor(100 + Math.random() * 900)}`;
const defaultName = "ADIF Estándar (1435 mm)";
class ADIFTemplatePage {
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
      name: defaultName,
      exact: true,
    });
    this.dialogInput3 = this.page.locator(
      '[aria-label="TemplateOptionSelect"] [role="combobox"]',
    );
    this.templateValidationText = this.page.getByText(
      "Template option is required",
    );
    this.options = this.page.getByRole("option");
    this.templateOptions = templateOptions;
    this.dialogConfirmButton = page.getByRole("button", {
      name: "ConfirmButton",
    });
    this.alert = page.getByRole("alert");
    this.newTemplateName = page.getByLabel(templateName);
  }

  async navigateCTM() {
    await this.settingsButton.click();
    await expect(this.ctmMenuItem).toBeVisible();
    await expect(this.ctmMenuItem).toHaveText("Configuration Template Manager");
    await this.ctmMenuItem.click();
    await expect(this.heading).toHaveText("Configuration Template Manager");
  }

  async adifTemplate() {
    try {
      await expect(this.newTemplateName).not.toBeVisible();
      await this.newTemplateButton.click();
      await this.dialogInput1.fill(templateName);
      await expect(this.dialogInput2).toBeVisible();
      await this.dialogInput2.click();
      await this.dialogInputOption.click();
      await expect(this.dialogInput3).toBeVisible();
      await this.dialogConfirmButton.click();
      await expect(this.templateValidationText).toBeVisible();
      await this.dialogInput3.click();
      await expect(this.options).toHaveText(this.templateOptions);
      await this.page.getByRole("option").nth(1).click();
      await this.dialogConfirmButton.click();
    } catch (error) {
      console.log("Cannot create template with ADIF");
    }
  }
}

export { ADIFTemplatePage };

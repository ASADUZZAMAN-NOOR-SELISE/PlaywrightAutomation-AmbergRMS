import { expect } from "@playwright/test";
import { languageData } from "../../../Utils/Data/language";

class LanguagePage {
  constructor(page) {
    this.page = page;
    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.dialog = page.getByRole("dialog");
    this.languageMenuItem = page.getByRole("menuitem", {
      name: new RegExp(languageData.languageTitles.join("|")),
    });
  }

  async openLanguageDialog() {
    await this.settingsButton.click();
    await this.languageMenuItem.click();
    await expect(this.dialog).toBeVisible();
  }

  async selectLanguage(optionLabel, saveButton, expectedHeading) {
    await this.page
      .getByLabel("system-language")
      .getByText(optionLabel)
      .check();
    await this.page.getByRole("button", { name: saveButton }).click();
    await expect(
      this.page.getByRole("heading", { name: expectedHeading }),
    ).toHaveText(expectedHeading);
  }

  async changeLanguage() {
    for (const lang of languageData.languageFlow) {
      await this.openLanguageDialog();
      await this.selectLanguage(
        lang.optionLabel,
        lang.saveButton,
        lang.expectedHeading,
      );
    }
  }
}

export { LanguagePage };

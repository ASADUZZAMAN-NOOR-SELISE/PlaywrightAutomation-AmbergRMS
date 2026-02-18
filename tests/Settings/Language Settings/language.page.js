import { expect } from "@playwright/test";

const LANGUAGE_TITLES = [
  "Language Settings",
  "Paramètres linguistiques",
  "Spracheinstellungen",
  "Impostazioni della lingua",
  "Ajustes de idioma",
  "Nastavení jazyka",
];

class LanguagePage {
  constructor(page) {
    this.page = page;

    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.languageMenuItem = page.getByRole("menuitem", {
      name: new RegExp(LANGUAGE_TITLES.join("|")),
    });

    this.dialog = page.getByRole("dialog");
    this.dialogHeading = page.getByLabel("Lang Dialouge Title Component");
    this.closeButton = this.dialog.locator("button[aria-label='Close']");
  }

  async navigateLanguageSettings() {
    await this.settingsButton.click();
    await expect(this.languageMenuItem).toBeVisible();
    await this.languageMenuItem.click();
    await expect(this.dialog).toBeVisible();
  }

  async verifyHeading() {
    await expect(this.dialogHeading).toHaveText(
      new RegExp(LANGUAGE_TITLES.join("|")),
    );
  }
}

export { LanguagePage };

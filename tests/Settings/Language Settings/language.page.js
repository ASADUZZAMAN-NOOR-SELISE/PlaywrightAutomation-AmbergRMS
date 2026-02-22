import { expect } from "@playwright/test";

const LANGUAGE_TITLES = [
  "Language Settings",
  "Paramètres linguistiques",
  "Spracheinstellungen",
  "Impostazioni della lingua",
  "Ajustes de idioma",
  "Nastavení jazyka",
];

const LANGUAGE_FLOW = [
  {
    optionLabel: "French",
    saveButton: "Save changes",
    expectedHeading: "Projets",
    menuItem: "Paramètres linguistiques",
  },
  {
    optionLabel: "Allemand",
    saveButton: "Sauvegarder les changements",
    expectedHeading: "Projekte",
    menuItem: "Spracheinstellungen",
  },
  {
    optionLabel: "Italienisch",
    saveButton: "Änderungen speichern",
    expectedHeading: "Progetti",
    menuItem: "Impostazioni della lingua",
  },
  {
    optionLabel: "Spagnolo",
    saveButton: "Salva le modifiche",
    expectedHeading: "Proyectos",
    menuItem: "Ajustes de idioma",
  },
  {
    optionLabel: "Checa",
    saveButton: "Guardar los cambios",
    expectedHeading: "Projekty",
    menuItem: "Nastavení jazyka",
  },
  {
    optionLabel: "Angličtina",
    saveButton: "Uložit změny",
    expectedHeading: "Projects",
    menuItem: "Language Settings",
  },
];

class LanguagePage {
  constructor(page) {
    this.page = page;

    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.dialog = page.getByRole("dialog");
    this.dialogHeading = page.getByLabel("Lang Dialouge Title Component");
    this.languageMenuItem = page.getByRole("menuitem", {
      name: new RegExp(LANGUAGE_TITLES.join("|")),
    });
  }

  async openLanguageDialog(menuItemRegex) {
    await this.settingsButton.click();
    await this.languageMenuItem.click();
    await expect(this.dialog).toBeVisible();
    await expect(this.dialogHeading).toHaveText(
      new RegExp(LANGUAGE_TITLES.join("|")),
    );
  }

  async selectLanguage(optionLabel, saveButton, expectedHeading) {
    await this.page
      .getByLabel("system-language")
      .getByText(optionLabel)
      .check();

    await this.page.getByRole("button", { name: saveButton }).click();

    await expect(
      this.page.getByRole("heading", { name: expectedHeading }),
    ).toBeVisible();
  }

  async changeLanguage() {
    for (const lang of LANGUAGE_FLOW) {
      await this.openLanguageDialog(new RegExp(lang.menuItem));
      await this.selectLanguage(
        lang.optionLabel,
        lang.saveButton,
        lang.expectedHeading,
      );
    }
  }
}

export { LanguagePage };

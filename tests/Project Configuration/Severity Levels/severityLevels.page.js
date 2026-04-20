import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";
import { languageData } from "../../Settings/Language Settings/language.js";
import { LanguagePage } from "../../Settings/Language Settings/language.page.js";

const projectName = `${data.templateName.en13848}-severity-levels`;
const severityLevels = [/^Alert$/i, /^Intervention$/i, /^Immediate Action$/i];
const expectedAbbr = [/^AL$/i, /^IL$/i, /^IAL$/i];

class SeverityLevelsPage {
  constructor(page) {
    this.page = page;
    this.languagePage = new LanguagePage(page);
    this.projectsHeading = page.getByRole("heading", { name: "Projects" });
    this.searchBox = page.getByRole("textbox", {
      name: "Search by Project Name",
    });
    this.projectName = page.getByLabel(projectName);
    this.projectConfig = page.getByText("Project Configuration");
    this.editConfigBtn = page.getByRole("button", {
      name: "Edit Configuration",
    });
    this.submitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });
    this.severityLevelDropDown = page.getByRole("button", {
      name: "Severity Levels",
    });
    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.dialog = page.getByRole("dialog");
    this.languageMenuItem = page.getByRole("menuitem", {
      name: new RegExp(languageData.languageTitles.join("|")),
    });
    this.addSeverityLevelBtn = page.getByRole("button", {
      name: "Add Severity Level",
    });
  }

  async navigateToSeverityLevels() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await await this.projectConfig.click();
    await this.editConfigBtn.click();
  }

  async verifySeverityLevelLabels() {
    await this.severityLevelDropDown.click();
    for (let i = 0; i < severityLevels.length; i++) {
      const input = this.page.locator(
        `input[name="Defects.LimitInfos.${i}.Name"]`,
      );
      await expect(input).toHaveValue(severityLevels[i]);
    }

    for (let i = 0; i < expectedAbbr.length; i++) {
      const input = this.page.locator(
        `input[name="Defects.LimitInfos.${i}.Abbreviation"]`,
      );
      await expect(input).toHaveValue(expectedAbbr[i]);
    }
  }

  async validateSeverity(severityLevels) {
    for (const severity of severityLevels) {
      await this.page.getByLabel(severity).click();
    }
  }
  async validateAbbreviation(abbr) {
    await expect(this.page.getByText(abbr).first()).toBeVisible();
  }

  async selectLanguage(optionLabel, saveButton) {
    await this.page
      .getByLabel("system-language")
      .getByText(optionLabel)
      .check();
    await this.page.getByRole("button", { name: saveButton }).click();
  }

  async changeLanguage() {
    for (const lang of languageData.languageFlow) {
      await this.languagePage.openLanguageDialog(lang.menuItem);
      await this.selectLanguage(lang.optionLabel, lang.saveButton);
      await this.validateSeverity(lang.severity);
      await this.validateAbbreviation(lang.abbr);
    }
  }

  async editLabelAbbreviation() {
    const input = this.page.locator(`input[name="Defects.LimitInfos.0.Name"]`);
    const updatedAbbreviation = this.page.locator(
      `input[name="Defects.LimitInfos.0.Abbreviation"]`,
    );
    await input.fill("");
    await updatedAbbreviation.fill("");
    await this.submitBtn.click();
    await expect(
      this.page.getByText("Severity 1 is required", { exact: true }),
    ).toBeVisible();
    await expect(
      this.page.getByText("Abbreviation is required", { exact: true }),
    ).toBeVisible();
    await input.fill("Emergency");
    await this.page.keyboard.press("Tab");
    await expect(updatedAbbreviation).toHaveValue("EMERGE");
    await this.submitBtn.click();
    await this.editConfigBtn.click();
    await this.addSeverityLevelBtn.click();
    await expect(
      this.page.locator(`input[name="Defects.LimitInfos.3.Name"]`),
    ).toHaveValue("Severity 4");
    await this.addSeverityLevelBtn.click();
    await expect(
      this.page.locator(`input[name="Defects.LimitInfos.4.Name"]`),
    ).toHaveValue("Severity 5");
    await expect(this.addSeverityLevelBtn).toBeDisabled();
  }
}

export default SeverityLevelsPage;

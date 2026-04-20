import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";

const projectName = `${data.templateName.en13848}-cantDefect`;

class CantDefectPage {
  constructor(page) {
    this.page = page;
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
    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.cantDefectDropDown = page.getByRole("button", {
      name: "Cant & Cant Defect",
    });
    this.cantBaseLengthInput = page.locator(
      '[name="Cant.MeanToPeakBaseLengths.0"]',
    );
    this.cantBaseLengthError = page.getByText("Base Length is required");
    this.cantBaseLengthRangeError = page.getByText(
      "Please enter Base Length between 0.1 and 200.00 m",
    );
  }

  async navigateToCantDefect() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await this.projectConfig.click();
    await this.editConfigBtn.click();
    await this.cantDefectDropDown.click();
  }
  async verifyBaseLengthValue() {
    await this.cantBaseLengthInput.fill("");
    await this.submitBtn.click();
    await expect(this.cantBaseLengthError).toBeVisible();
    await this.cantBaseLengthInput.fill("300");
    await this.submitBtn.click();
    await expect(this.cantBaseLengthError).not.toBeVisible();
    await expect(this.cantBaseLengthRangeError).toBeVisible();
  }
}

export default CantDefectPage;

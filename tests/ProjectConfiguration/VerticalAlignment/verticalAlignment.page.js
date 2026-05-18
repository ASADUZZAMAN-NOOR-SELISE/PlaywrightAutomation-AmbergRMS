import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";

const projectName = `${data.templateName.en13848}-vertical-alignment`;

const expectedLimits = [
  { lower: "-8.0", upper: "8.0" },
  { lower: "-9.0", upper: "9.0" },
  { lower: "-10.0", upper: "10.0" },
];

export class VerticalAlignmentPage {
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
    this.alert = page.getByRole("alert");
    this.settingsButton = page.locator("button[aria-label='Settings']");

    this.symmetricLimitsCheckbox = page.getByRole("checkbox", {
      name: "Symmetric Limits",
    });
    this.consisderCurvatureCheckbox = page.getByRole("checkbox", {
      name: "Consider Curvature",
    });
    this.limitTab = page.getByRole("tab", {
      name: "Limit table(s) Twist: Curve",
    });
    this.limitTable = page.locator(
      'span:has-text("LIMIT PARAMETERS FOR TWIST")',
    );
    this.vrtAllignBtn = page.getByRole("button", {
      name: "Vertical Alignment",
    });
    this.vrtVersineCheckbox = page.getByRole("checkbox", {
      name: "Vertical Versine",
    });
    this.chordLengthInput = page.locator(
      '[name="Versines.VerticalVersinesConfiguration.Evaluations.0.ChordLength"]',
    );
    this.baseLengthInput = page.locator(
      '[name="Versines.VerticalVersinesConfiguration.MeanToPeakEvaluations.0.BaseLength"]',
    );
    this.chordLengthError = page.getByText("Chord Length is required", {
      exact: true,
    });
    this.baseLengthError = page.getByText("Base Length is required", {
      exact: true,
    });
    this.chordLengthRangeError = page.getByText(
      "Please enter Chord Length between 0.10 and 200.00 m",
      { exact: true },
    );
    this.baseLengthRangeError = page.getByText(
      "Please enter Base Length between 0.1 and 200.00 m",
      { exact: true },
    );
    this.addChordLengthBtn = page.getByRole("button", {
      name: /Add Chord Length/i,
    });
    this.chrordLength2Input = page.locator(
      '[name="Versines.VerticalVersinesConfiguration.Evaluations.1.ChordLength"]',
    );
    this.baseLength2Input = page.locator(
      '[name="Versines.VerticalVersinesConfiguration.MeanToPeakEvaluations.1.BaseLength"]',
    );
    this.movingChrod = page.locator(
      '[id="mui-component-select-Versines.VerticalVersinesConfiguration.Evaluations.1.Ratio"]',
    );

    this.movingChrodOption = page.getByRole("option", {
      name: "Moving Chord 40:60",
    });
  }

  async navigateToVA() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await this.projectConfig.click();
    await this.editConfigBtn.click();
    await this.vrtAllignBtn.click();
    await this.vrtVersineCheckbox.check();
  }

  async clickSubmit() {
    await this.page.waitForTimeout(3000); // To avoid CLI error due to rapid interactions
    await this.submitBtn.click();
  }

  async verifyMandatoryFieldValidation() {
    await this.chordLengthInput.fill("");
    await this.clickSubmit();
    await expect(this.chordLengthError).toBeVisible();
    await this.chordLengthInput.fill("300");
    await this.clickSubmit();
    await expect(this.chordLengthError).not.toBeVisible();
    await expect(this.chordLengthRangeError).toBeVisible();
    await this.chordLengthInput.fill("2.00");
    await this.clickSubmit();
    await expect(this.chordLengthRangeError).not.toBeVisible();
    await this.baseLengthInput.fill("");
    await this.clickSubmit();
    await expect(this.baseLengthError).toBeVisible();
    await this.baseLengthInput.fill("300");
    await this.clickSubmit();
    await expect(this.baseLengthError).not.toBeVisible();
    await expect(this.baseLengthRangeError).toBeVisible();
    await this.baseLengthInput.fill("2.00");
    await this.clickSubmit();
    await expect(this.baseLengthRangeError).not.toBeVisible();
  }

  async addChordLength() {
    await this.editConfigBtn.click();
    await this.addChordLengthBtn.click();
    await expect(this.chrordLength2Input).toBeVisible();
    await expect(this.baseLength2Input).toBeVisible();
    await this.chrordLength2Input.fill("3.00");
    await this.baseLength2Input.fill("3.00");
    await this.movingChrod.click();
    await this.movingChrodOption.click();
    await this.clickSubmit();
  }
}

import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";
import { time } from "node:console";

const projectName = `${data.templateName.en13848}-horizontal-alignment`;

const expectedLimits = [
  { lower: "-8.0", upper: "8.0" },
  { lower: "-9.0", upper: "9.0" },
  { lower: "-10.0", upper: "10.0" },
];

export class HorizontalAlignmentPage {
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
    this.hztAllignBtn = page.getByRole("button", {
      name: "Horizontal Alignment",
    });
    this.hztVersineCheckbox = page.getByRole("checkbox", {
      name: "Horizontal Versine",
    });
    this.chordLengthInput = page.locator(
      '[name="Versines.HorizontalVersinesConfiguration.Evaluations.0.ChordLength"]',
    );
    this.baseLengthInput = page.locator(
      '[name="Versines.HorizontalVersinesConfiguration.MeanToPeakEvaluations.0.BaseLength"]',
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
      '[name="Versines.HorizontalVersinesConfiguration.Evaluations.1.ChordLength"]',
    );
    this.baseLength2Input = page.locator(
      '[name="Versines.HorizontalVersinesConfiguration.MeanToPeakEvaluations.1.BaseLength"]',
    );
    this.movingChrod = page.locator(
      '[id="mui-component-select-Versines.HorizontalVersinesConfiguration.Evaluations.1.Ratio"]',
    );

    this.movingChrodOption = page.getByRole("option", {
      name: "Moving Chord 40:60",
    });
  }

  async navigateToHA() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await this.projectConfig.click();
    await this.editConfigBtn.click();
    await this.hztAllignBtn.click();
    await this.hztVersineCheckbox.check();
  }

  async validateField({
    input,
    requiredError,
    rangeError,
    validValue = "2.00",
    invalidValue = "300",
  }) {
    await input.clear();
    await input.press("Tab");
    await expect(requiredError).toBeVisible();
    await input.fill(invalidValue);
    await this.submitBtn.click({ force: true });
    await expect(requiredError).not.toBeVisible();
    await expect(rangeError).toBeVisible();
    await input.fill(validValue);
    await this.submitBtn.click({ force: true });
    await expect(rangeError).not.toBeVisible();
  }

  async verifyMandatoryFieldValidation() {
    await this.validateField({
      input: this.chordLengthInput,
      requiredError: this.chordLengthError,
      rangeError: this.chordLengthRangeError,
    });
    await this.validateField({
      input: this.baseLengthInput,
      requiredError: this.baseLengthError,
      rangeError: this.baseLengthRangeError,
    });
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
    await this.submitBtn.click({ force: true });
  }
}

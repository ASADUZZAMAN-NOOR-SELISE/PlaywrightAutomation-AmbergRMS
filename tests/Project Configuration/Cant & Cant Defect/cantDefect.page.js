import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";

const projectName = `${data.templateName.en13848}-cantDefect`;

const expectedLimits = [
  { lower: "-8.0", upper: "8.0" },
  { lower: "-9.0", upper: "9.0" },
  { lower: "-10.0", upper: "10.0" },
];

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
    this.alert = page.getByRole("alert");
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
    this.symmetricLimitsCheckbox = page.getByRole("checkbox", {
      name: "Symmetric Limits",
    });
    this.consisderCurvatureCheckbox = page.getByRole("checkbox", {
      name: "Consider Curvature",
    });
    this.limitTab = page.getByRole("tab", {
      name: "Limit table(s) Cant: Curve",
    });
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
    await this.cantBaseLengthInput.fill("25.00");
    await this.submitBtn.click();
    await expect(this.cantBaseLengthRangeError).not.toBeVisible();
    await this.editConfigBtn.click();
    await this.symmetricLimitsCheckbox.uncheck();
  }

  async fillLimit(limitsSpeed, speedIndex, severityIndex, lower, upper) {
    const base = `Defects.Cant.MeanToPeakLimits.${limitsSpeed}.LimitsBySpeed.${speedIndex}.LimitsBySeverity.${severityIndex}`;
    const lowerInput = this.page.locator(`input[name="${base}.Lower"]`);
    const upperInput = this.page.locator(`input[name="${base}.Upper"]`);

    await lowerInput.scrollIntoViewIfNeeded();
    if (lower !== undefined) {
      await lowerInput.fill(lower);
    }

    await upperInput.scrollIntoViewIfNeeded();
    await upperInput.waitFor({ state: "visible" });
    if (upper !== undefined) {
      await upperInput.fill(upper);
    }
  }

  async fillAllSeverityLimits() {
    for (let i = 0; i < expectedLimits.length; i++) {
      await this.fillLimit(
        0,
        5,
        i,
        expectedLimits[i].lower,
        expectedLimits[i].upper,
      );
    }
    await this.submitBtn.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }

  async verifyNoCheckboxValues() {
    const minValues = this.page.locator('[aria-label="MinValueALCant5"]');
    const maxValues = this.page.locator('[aria-label="MaxValueALCant5"]');
    for (let i = 0; i < expectedLimits.length; i++) {
      const { lower, upper } = expectedLimits[i];
      await expect(minValues.nth(i)).toHaveText(lower);
      await expect(maxValues.nth(i)).toHaveText(upper);
    }
  }

  async symmetricLimitsCheckboxValidation() {
    await this.editConfigBtn.click();
    await this.symmetricLimitsCheckbox.check();
    for (let i = 0; i < expectedLimits.length; i++) {
      await this.fillLimit(0, 5, i, undefined, expectedLimits[i].upper);
    }
    await this.submitBtn.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }

  async verifySymmetricLimits() {
    const maxValues = this.page.locator('[aria-label="MaxValueALCant5"]');
    for (let i = 0; i < expectedLimits.length; i++) {
      const { upper } = expectedLimits[i];
      await expect(maxValues.nth(i)).toHaveText(upper);
    }
  }

  async considerCurvatureCheckboxValidation() {
    const limits = [
      { lower: "-1.0", upper: "1.0" },
      { lower: "-2.0", upper: "2.0" },
      { lower: "-3.0", upper: "3.0" },
    ];

    await this.editConfigBtn.click();
    await this.symmetricLimitsCheckbox.uncheck();
    await this.consisderCurvatureCheckbox.check();

    const fillAllLimits = async (limitsSpeed) => {
      for (let speedIndex = 0; speedIndex < 6; speedIndex++) {
        for (
          let severityIndex = 0;
          severityIndex < limits.length;
          severityIndex++
        ) {
          const { lower, upper } = limits[severityIndex];
          await this.fillLimit(
            limitsSpeed,
            speedIndex,
            severityIndex,
            lower,
            upper,
          );
        }
      }
    };

    await fillAllLimits(1);
    await this.limitTab.click();
    await fillAllLimits(2);
    await this.submitBtn.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }

  async considerSymmetricCurvatureLimitsVerification() {
    const limits = [{ upper: "1.0" }, { upper: "2.0" }, { upper: "3.0" }];
    await this.editConfigBtn.click();
    await this.symmetricLimitsCheckbox.check();

    const fillAllLimits = async (limitsSpeed) => {
      for (let speedIndex = 0; speedIndex < 6; speedIndex++) {
        for (
          let severityIndex = 0;
          severityIndex < limits.length;
          severityIndex++
        ) {
          const { upper } = limits[severityIndex];
          await this.fillLimit(
            limitsSpeed,
            speedIndex,
            severityIndex,
            undefined,
            upper,
          );
        }
      }
    };

    await fillAllLimits(1);
    await this.limitTab.click();
    await fillAllLimits(2);
    await this.submitBtn.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }
}

export default CantDefectPage;

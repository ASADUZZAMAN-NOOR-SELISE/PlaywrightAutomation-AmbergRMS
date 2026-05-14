import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";

const projectName = `${data.templateName.en13848}-tqi`;

const expectedLimits = [
  { lower: "-8.0", upper: "8.0" },
  { lower: "-9.0", upper: "9.0" },
  { lower: "-10.0", upper: "10.0" },
];

class TQIPage {
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
    this.tqiBtn = page.getByRole("button", {
      name: "Track Quality Index",
    });
    this.lengthInput = page.locator('[name="Tqi.SegmentSize"]');
    this.lengthError = page.getByText("Value is required", { exact: true });
    this.lengthRangeError = page.getByText(
      "Value must be equal or greater than 0.10 m",
      { exact: true },
    );
    this.calculationMethodDropdown = page.getByTitle("TUG TQI", {
      exact: true,
    });
    this.isolatedDefectsOption = page.getByText("Isolated Defects");
    this.alertLimitRadio = page.getByRole("radio", { name: "AlertLimit" });
    this.tqiCalculationMethodText = page.getByText(
      "TQI Calculation Method:Isolated Defects (After EN13848-6)",
    );
    this.severityLevelAlertText = page.getByText("Severity Level:Alert");
    this.severityLevelInterventionText = page.getByText(
      "Severity Level:Intervention",
    );
    this.severityLevelImmediateActionText = page.getByText(
      "Severity Level:Immediate Action",
    );
    this.interventionLimitRadio = page.getByRole("radio", {
      name: "InterventionLimit",
    });
    this.immediateActionLimitRadio = page.getByRole("radio", {
      name: "ImmediateactionLimit",
    });
    this.comoboxIsolatedDefects = page.getByRole("combobox", {
      name: "Isolated Defects",
    });
    this.fiveParameterTrackOption = page.locator(
      ':text("Five-Parameter Track Defectiveness (w5)")',
    );
    this.fiveParameterText = page.getByText(
      "TQI Calculation Method:Five-Parameter Track",
    );
    this.loader = page.locator('[aria-label="loader"]');
  }

  async navigateToTQI() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await this.projectConfig.click();
    await this.editConfigBtn.click();
    await this.tqiBtn.click();
  }

  async verifyMandatoryFieldValidation() {
    await this.lengthInput.fill("");
    await this.submitBtn.click();
    await expect(this.lengthError).toBeVisible();
    await this.lengthInput.fill("0.01");
    await this.submitBtn.click();
    await expect(this.lengthError).not.toBeVisible();
    await expect(this.lengthRangeError).toBeVisible();
    await this.lengthInput.fill("100");
    await this.submitBtn.click();
    await expect(this.lengthRangeError).not.toBeVisible();
  }

  async tqiCalculationMethod() {
    await this.editConfigBtn.click();
    await expect(this.calculationMethodDropdown).toBeVisible();
    await this.calculationMethodDropdown.click();
    await this.isolatedDefectsOption.click();
    await this.alertLimitRadio.check();
    await this.submitBtn.click();
    await expect(this.tqiCalculationMethodText).toBeVisible();
    await expect(this.severityLevelAlertText).toBeVisible();
    await this.editConfigBtn.click();
    await this.interventionLimitRadio.check();
    await this.submitBtn.click();
    await expect(this.severityLevelInterventionText).toBeVisible();
    await this.editConfigBtn.click();
    await this.immediateActionLimitRadio.check();
    await this.submitBtn.click();
    await expect(this.severityLevelImmediateActionText).toBeVisible();

    // await this.editConfigBtn.click();
    // await this.page
    //   .getByRole("combobox", { name: "Five-Parameter Track" })
    //   .click();
    // await this.page.getByText("Track Roughness Index (Amtrak)").click();
    // await this.submitBtn.waitFor({ state: "visible" });
    // await this.submitBtn.click();
    // await expect(this.page.getByRole("alert")).toBeVisible();
    // await expect(
    //   this.page.getByText(
    //     "TQI Calculation Method: Track Roughness Index (Amtrak)",
    //   ),
    // ).toBeVisible();
  }
  async fiveParameterOption() {
    await this.editConfigBtn.click();
    await this.comoboxIsolatedDefects.click();
    // await this.fiveParameterTrackOption.click();
    await this.page.getByText("Five-Parameter Track").click();
    await this.alertLimitRadio.check();
    await this.submitBtn.click();
    await expect(this.fiveParameterText).toBeVisible();
    await expect(this.severityLevelAlertText).toBeVisible();

    await this.editConfigBtn.click();
    // await expect(this.interventionLimitRadio).toBeVisible();
    // await this.interventionLimitRadio.check();
    await this.page.getByRole("radio", { name: "InterventionLimit" }).check();
    await this.submitBtn.click();
    await this.page.waitForTimeout(1000);
    // await expect(this.page.getByRole("alert")).toBeVisible();
    // await expect(this.severityLevelInterventionText).toBeVisible();
    await expect(
      this.page.getByText("Severity Level:Intervention"),
    ).toBeVisible();
    await this.editConfigBtn.click();
    await this.submitBtn.waitFor({ state: "visible" });
    await this.page
      .getByRole("radio", { name: "ImmediateactionLimit" })
      .check();

    await expect(this.page.getByText("Severity Level:Immediate")).toBeVisible();

    // await expect(this.immediateActionLimitRadio).toBeVisible();
    // await this.immediateActionLimitRadio.check();

    // await this.submitBtn.click();
    // await expect(this.page.getByRole("alert")).toBeVisible();
    // await expect(this.severityLevelImmediateActionText).toBeVisible();
  }
}

export default TQIPage;

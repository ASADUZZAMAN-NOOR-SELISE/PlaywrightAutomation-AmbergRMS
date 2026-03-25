import { expect } from "@playwright/test";

const projectName = "dummy";

class GeneralInformationParametersPage {
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
    this.gipHeading = page.getByRole("button", {
      name: "General Information & Parameters",
    });
    this.configNameLabel = page
      .locator("label")
      .filter({ hasText: "Configuration Name *" });
    this.samplingStepLabel = page
      .locator("label")
      .filter({ hasText: "Sampling Step [m] *" });
    this.curvatureThresholdLabel = page
      .locator("label")
      .filter({ hasText: "Curvature Threshold (Radius) [m] *" });
  }

  async navigateToGIP() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.click();
    await await this.projectConfig.click();
    await this.editConfigBtn.click();
  }

  async verifyGIPInformation() {
    await expect(this.gipHeading).toHaveText(
      "General Information & Parameters",
    );
    await expect(this.configNameLabel).toHaveText("Configuration Name *");
    await expect(this.samplingStepLabel).toHaveText("Sampling Step [m] *");
    await expect(this.curvatureThresholdLabel).toHaveText(
      "Curvature Threshold (Radius) [m] *",
    );
  }
}

export default GeneralInformationParametersPage;

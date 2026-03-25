import { expect } from "@playwright/test";

const projectName = "dummy";

class SpeedZonePage {
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
    this.speedZonesTab = page.getByRole("button", { name: "Speed Zones" });
    this.zoneNameInput = page.locator('input[name="SpeedZones.Zones.0.Name"]');
    this.maxSpeedInput = page.locator(
      'input[name="SpeedZones.Zones.0.MaxSpeed"]',
    );
    this.nameError = page.getByText("Speed Zone Name is required");
    this.maxError = page.locator(
      "p:has-text('Max value must be greater than Min value')",
    );
  }

  async navigateToSpeedZone() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.click();
    await await this.projectConfig.click();
    await this.editConfigBtn.click();
  }

  async verifyMandatoryFields() {
    await this.speedZonesTab.click();
    await this.zoneNameInput.click();
    await this.zoneNameInput.fill("");
    await this.maxSpeedInput.click();
    await this.maxSpeedInput.fill("");
    await this.page.keyboard.press("Tab");
    await expect(this.nameError).toHaveText("Speed Zone Name is required");
    await expect(this.maxError).toBeVisible();
  }
}

export default SpeedZonePage;

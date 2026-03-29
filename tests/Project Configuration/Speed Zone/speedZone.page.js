import { expect } from "@playwright/test";

const projectName = "dummy";
const zoneNameInput = "G";
const maxSpeedInput = "370.00";

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
    this.addSpeedZoneBtn = page.getByRole("button", { name: "Add Speed Zone" });
    this.zoneNameInput = page.locator('input[name="SpeedZones.Zones.6.Name"]');
    this.maxSpeedInput = page.locator(
      'input[name="SpeedZones.Zones.6.MaxSpeed"]',
    );
    this.nameError = page.getByText("Speed Zone Name is required");
    this.maxError = page.locator(
      "p:has-text('Max value must be greater than Min value')",
    );
    this.submitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });
  }

  async navigateToSpeedZone() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.click();
    await await this.projectConfig.click();
    await this.editConfigBtn.click();
  }

  async addSpeedZone() {
    await this.speedZonesTab.click();
    await this.addSpeedZoneBtn.click();
    await this.zoneNameInput.fill("");
    await this.maxSpeedInput.fill("");
    await this.page.keyboard.press("Tab");

    await expect(this.nameError).toHaveText("Speed Zone Name is required");
    await expect(this.maxError).toBeVisible();

    await this.zoneNameInput.fill(zoneNameInput);
    await this.page.keyboard.press("Tab");
    await this.maxSpeedInput.fill(maxSpeedInput);
    await this.page.keyboard.press("Tab");

    await expect(this.nameError).toBeHidden();
    await expect(this.maxError).toBeHidden();
  }

  async verifyLimitTables() {
    await this.submitBtn.click();
    await expect(this.maxError).toBeVisible();

    const generateLimits = (action, severity) =>
      this.page.locator(
        `input[name="Defects.${action}.0.LimitsBySpeed.6.LimitsBySeverity.${severity}.Upper"]`,
      );
    const actions = [["Gauge.NominalToPeakLimits"]];

    for (const action of actions) {
      for (let i = 0; i < 3; i++) {
        const locator = generateLimits(action[0], i);

        await locator.fill("");
        await locator.fill("1");
      }
    }
    await this.submitBtn.click();
  }
  async deleteSpeedZone() {}
}

export default SpeedZonePage;

import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information";

const projectName = `${data.templateName.en13848}-speedzone`;
const zoneNameInput = "G";
const maxSpeedInput = "370.00";

class SpeedZonePage {
  constructor(page) {
    this.page = page;
    this.projectsHeading = page.getByRole("heading", { name: "Projects" });
    this.searchBox = page.getByRole("textbox", {
      name: "Search by Project Name",
    });
    this.projectName = page.getByLabel(projectName).first();
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
  async addSpeedZonesUntilLimit() {
    const limitText = this.page.getByText("Maximum 10 speed zones can be");

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      if (await limitText.isVisible().catch(() => false)) break;
      if (!(await this.addSpeedZoneBtn.isEnabled().catch(() => false))) break;

      await this.addSpeedZoneBtn.click();
      attempts++;
    }
  }
  async addSpeedZone() {
    await this.speedZonesTab.click();
    await this.addSpeedZonesUntilLimit();
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

    const basePath = (type) =>
      `Defects.${type}.0.LimitsBySpeed.6.LimitsBySeverity`;

    const toggleButtons = {
      "Gauge.NominalToPeakLimits": { name: "Gauge & Gauge Defect" },
      "Cant.MeanToPeakLimits": { name: "Cant & Cant Defect" },
      "Twist.Limits": { name: "Twist", exact: true },
      "HorizontalAlignment.D1RailLimits": { name: "Horizontal Alignment" },
      "VerticalAlignment.D1RailLimits": { name: "Vertical Alignment" },
    };

    const defectData = {
      "Gauge.NominalToPeakLimits": [
        { lower: "-4.0", upper: "21" },
        { lower: "-5.0", upper: "24" },
        { lower: "-6.0", upper: "29" },
      ],

      "Cant.MeanToPeakLimits": Array.from({ length: 3 }, (_, i) => ({
        upper: String(7 + i),
      })),

      "Twist.Limits": Array.from({ length: 3 }, (_, i) => ({
        upper: String(4 + i),
      })),

      "HorizontalAlignment.D1RailLimits": [4, 6, 9].map((v) => ({
        upper: String(v),
      })),

      "VerticalAlignment.D1RailLimits": [7, 8, 15].map((v) => ({
        upper: String(v),
      })),
    };

    const fillField = async (locator, value) => {
      await locator.fill(value);
      await locator.press("Tab");
    };

    for (const [type, values] of Object.entries(defectData)) {
      const base = basePath(type);
      const toggleConfig = toggleButtons[type];

      const toggle = this.page.getByRole("button", { ...toggleConfig });

      await toggle.click();

      for (let i = 0; i < values.length; i++) {
        const { lower, upper } = values[i];

        if (lower) {
          await fillField(
            this.page.locator(`input[name="${base}.${i}.Lower"]`),
            lower,
          );
        }

        if (upper) {
          await fillField(
            this.page.locator(`input[name="${base}.${i}.Upper"]`),
            upper,
          );
        }
      }
      await toggle.click();
    }

    await this.submitBtn.click();
    await expect(this.page.getByRole("alert")).toHaveText(
      "Configuration updated successfully",
    );
  }
  async deleteSpeedZone() {
    await this.editConfigBtn.click();

    const deleteBtn = (n) =>
      this.page.getByRole("button", { name: `SpeedZoneDeleteButton${n}` });

    for (let i = 10; i > 0; i--) {
      const btn = deleteBtn(i);

      if (await btn.isVisible().catch(() => false)) {
        await btn.click();
      }
    }
    await expect(deleteBtn(0)).not.toBeVisible();
  }
}

export default SpeedZonePage;

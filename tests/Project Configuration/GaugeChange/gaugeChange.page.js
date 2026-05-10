import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information";
const projectName = `${data.templateName.en13848}-gaugechange`;

class GauageChangePage {
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
    this.submitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });
    this.alert = page.getByRole("alert");
    this.gaugeChangeOpen = page.getByRole("button", { name: "Gauge Change" });
    this.gaugeChangeBase1 = page.getByRole("spinbutton", {
      name: "Gauge Change Base 1 [m]",
    });
    this.addGaugeChangeBaseBtn = page.getByRole("button", {
      name: "Add Gauge Change Base",
    });
    this.gaugeChangeBase2 = page.getByRole("spinbutton", {
      name: "Gauge Change Base 2 [m]",
    });
    this.gauageChangeValidationMsg = page.getByText(
      "Please enter Base Length between 0.1 and 200.00 m",
      { exact: true },
    );
    this.gaugeChangeBase3 = page.getByRole("spinbutton", {
      name: "Gauge Change Base 3 [m]",
    });
  }

  async navigateToGaugeChange() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.fill(projectName);
    await this.projectName.first().click();
    await this.projectConfig.click();
  }

  async editGaugeChange() {
    await this.editConfigBtn.click();
    await this.gaugeChangeOpen.click();
    await expect(this.gaugeChangeBase1).toBeVisible();
    await expect(this.gaugeChangeBase1).toHaveValue("1.00");
    await this.addGaugeChangeBaseBtn.click();
    await this.gaugeChangeBase2.fill("300");
    await this.submitBtn.click();
    await expect(this.gauageChangeValidationMsg).toBeVisible();
    await this.addGaugeChangeBaseBtn.click();
    await this.gaugeChangeBase3.fill("400");
    await this.submitBtn.click();
    await expect(this.gauageChangeValidationMsg).toHaveCount(2);
    await this.gaugeChangeBase2.fill("2.00");
    await this.gaugeChangeBase3.fill("3.00");
    await expect(this.gauageChangeValidationMsg).not.toBeVisible();
    await this.submitBtn.click();
    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }
}

export default GauageChangePage;

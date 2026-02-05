import { expect } from "@playwright/test";

class AboutUsPage {
  constructor(page) {
    this.page = page;

    this.supportButton = page.locator("button[aria-label='Support']");
    this.aboutMenuItem = page.getByRole("menuitem", { name: "About" });

    this.dialog = page.getByRole("dialog");
  }

  async openAboutDialog() {
    await this.supportButton.click();
    await this.aboutMenuItem.click();
  }

  versionLabel() {
    return this.dialog.getByText("Version", { exact: true });
  }

  buildNumberLabel() {
    return this.dialog.getByText("Build Number", { exact: true });
  }

  releaseDateLabel() {
    return this.dialog.getByText("Release Date", { exact: true });
  }

  plusExpiryFeature() {
    return this.dialog.getByLabel("PlusExpiryFeature");
  }

  plusExpiryFeatureProRailVersion() {
    return this.dialog.getByLabel("PlusExpiryFeatureProRailVersion");
  }

  privacyPolicyLink() {
    return this.dialog.getByRole("link", { name: /privacy policy/i });
  }

  async verifyDialogIsVisible() {
    await expect(this.dialog).toBeVisible();
  }

  async verifyRequiredLabels() {
    await expect(this.versionLabel()).toHaveText("Version");
    await expect(this.buildNumberLabel()).toHaveText("Build Number");
    await expect(this.releaseDateLabel()).toHaveText("Release Date");
  }

  async verifyLicenseRows() {
    await expect(this.plusExpiryFeature()).toBeVisible();
    await expect(this.plusExpiryFeatureProRailVersion()).toBeVisible();
  }

  async verifyBuildNumber(expectedBuild) {
    const buildRow = this.buildNumberLabel().locator("..");
    const actualText = await buildRow.textContent();
    const actualBuild = actualText?.replace("Build Number", "").trim();
    expect(actualBuild).toEqual(expectedBuild);
  }

  async verifyVersion(expectedVersion) {
    const versionRow = this.versionLabel().locator("..");
    const actualText = await versionRow.textContent();
    const actualVersion = actualText?.replace("Version", "").trim();
    expect(actualVersion).toEqual(expectedVersion);
  }

  async openPrivacyPolicy() {
    const popupPromise = this.page.waitForEvent("popup");
    await this.privacyPolicyLink().click();
    return popupPromise;
  }
}

export { AboutUsPage };

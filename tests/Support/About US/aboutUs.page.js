import { expect } from "@playwright/test";

class AboutUsPage {
  constructor(page) {
    this.page = page;

    this.supportButton = page.locator("button[aria-label='Support']");
    this.aboutMenuItem = page.getByRole("menuitem", { name: "About" });

    this.dialog = page.getByRole("dialog");

    this.closeButton = this.dialog.locator("button[aria-label='Close']");
  }

  async openAboutDialog() {
    await this.supportButton.click();
    await this.aboutMenuItem.click();
  }

  async closeAboutDialog() {
    await this.closeButton.click();
  }

  version() {
    return this.dialog.getByText("Version", { exact: true });
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

  async privacyPolicyLink() {
    const link = this.dialog.getByRole("link", { name: /privacy policy/i });
    await expect(link).toContainText(/privacy policy/i);
    return link;
  }

  async verifyDialogIsVisible() {
    await expect(this.dialog).toBeVisible();
  }

  async verifyRequiredLabels() {
    await expect(this.version()).toHaveText("Version");
    await expect(this.buildNumber()).toHaveText("Build Number");
    await expect(this.releaseDateLabel()).toHaveText("Release Date");
  }

  async verifyLicenseRows() {
    await expect(this.plusExpiryFeature()).toBeVisible();
    await expect(this.plusExpiryFeatureProRailVersion()).toBeVisible();
  }

  async verifyVersion(expectedVersion) {
    const versionRow = this.version().locator("..");
    const actualText = await versionRow.textContent();
    const actualVersion = actualText?.replace("Version", "").trim();
    expect(actualVersion).toEqual(expectedVersion);
  }

  async openPrivacyPolicy() {
    const page1 = this.page.waitForEvent("popup");
    const link = await this.privacyPolicyLink();
    await link.click();
    return page1;
  }

  async verifyDialogIsNotVisible() {
    await expect(this.dialog).not.toBeVisible();
  }
}

export { AboutUsPage };

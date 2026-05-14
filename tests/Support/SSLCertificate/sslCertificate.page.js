import { expect } from "@playwright/test";

class SSLCertificatePage {
  constructor(page) {
    this.page = page;

    this.supportButton = page.locator("button[aria-label='Support']");
    this.sslCertificateMenuItem = page.getByRole("menuitem", {
      name: "SSL Certificate",
    });
    this.dialog = page.getByRole("dialog");
    this.logo = page.getByTestId("WarningIcon");
    this.closeButton = this.dialog.locator("button[aria-label='Close']");
  }

  async openSSLCertificateDialog() {
    await this.supportButton.click();
    await this.sslCertificateMenuItem.click();
  }
  async verifyDialogIsVisible() {
    await expect(this.dialog).toBeVisible();
  }
  async verifyWarningIcon() {
    await expect(this.logo).toBeVisible();
  }
  async closeSSLCertificateDialog() {
    await this.closeButton.click();
  }
}

export { SSLCertificatePage };

import { expect } from "@playwright/test";

class CTMPage {
  constructor(page) {
    this.page = page;

    this.settingsButton = page.locator("button[aria-label='Settings']");
    this.ctmMenuItem = page.getByRole("menuitem", {
      name: "Configuration Template Manager",
    });

    this.heading = page.getByRole("heading", {
      name: "Configuration Template Manager",
    });
  }

  async navigateCTM() {
    await this.settingsButton.click();
    await expect(this.ctmMenuItem).toBeVisible();
    await this.ctmMenuItem.click();
    await expect(this.heading).toBeVisible();
  }
}

export { CTMPage };

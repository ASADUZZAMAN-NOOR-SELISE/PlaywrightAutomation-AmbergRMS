import { expect } from "@playwright/test";

class ContactUsPage {
  constructor(page) {
    this.page = page;

    this.supportButton = page.locator("button[aria-label='Support']");
    this.contactUsMenuItem = page.getByRole("menuitem", { name: "Contact Us" });

    this.dialog = page.getByRole("dialog");

    this.companyName = page.getByText("Amberg Technologies AG");
    this.street = page.getByText("Trockenloostrasse 21");
    this.city = page.getByText("8105 Regensdorf-Watt");
    this.country = page.getByText("Switzerland");
    this.phone = page.getByText("Phone: +41 44 870 92 92");
    this.email = page.locator('a[href="mailto:support.rail@amberg.ch"]');
    this.website = page.locator('a[href="https://www.ambergrail.com"]');
  }

  async openContactUsDialog() {
    await this.supportButton.click();
    await this.contactUsMenuItem.click();
  }

  async verifyDialogIsVisible() {
    await expect(this.dialog).toBeVisible();
  }

  async logoVisible() {
    return this.dialog.getByRole("img", { name: "logo" }).isVisible();
  }

  async verifyContactDetails() {
    await expect(this.companyName).toHaveText("Amberg Technologies AG");
    await expect(this.street).toHaveText("Trockenloostrasse 21");
    await expect(this.city).toHaveText("8105 Regensdorf-Watt");
    await expect(this.country).toHaveText("Switzerland");
    await expect(this.phone).toHaveText("Phone: +41 44 870 92 92");
    await expect(this.email).toHaveAttribute(
      "href",
      "mailto:support.rail@amberg.ch",
    );
    await expect(this.website).toHaveText("www.ambergrail.com");
  }

  // async emailRedirected() {
  //   const [request] = await Promise.all([
  //     this.page.waitForEvent("request"),
  //     this.email.click(),
  //   ]);

  //   expect(request.url()).toContain("support.rail@amberg.ch");
  // }
}

export { ContactUsPage };

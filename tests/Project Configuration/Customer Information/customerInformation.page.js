import { expect } from "@playwright/test";

class CustomerInformationPage {
  constructor(page) {
    this.page = page;

    this.projectsHeading = page.getByRole("heading", { name: "Projects" });
    this.projectName = page.getByLabel("Samiha Test");
    this.projectConfig = page.getByText("Project Configuration");
    this.customerInfoBtn = page.getByRole("button", {
      name: "Customer Information",
    });

    this.customerSection = page.locator("#customer_info");
  }

  async navigateToCustomerInfo() {
    await this.projectsHeading.click();
    await this.projectName.click();
    await this.projectConfig.click();
    await this.customerInfoBtn.click();
  }

  async verifyCustomerInformation(customerData) {
    const customerFields = [
      { label: "CompanyName", value: customerData.name },
      { label: "Street", value: customerData.street },
      { label: "Town", value: customerData.town },
      { label: "Region", value: customerData.region },
      { label: "PostalCode", value: customerData.postalCode },
      { label: "Telephone", value: customerData.phone },
      { label: "Country", value: customerData.country },
      { label: "Email", value: customerData.email },
    ];

    for (const field of customerFields) {
      const inputField = this.customerSection.getByLabel(field.label, {
        exact: true,
      });

      await expect(inputField).toBeVisible();

      await expect(
        this.customerSection.getByText(field.value, { exact: true }),
      ).toHaveText(field.value);
    }
  }
}

export default CustomerInformationPage;

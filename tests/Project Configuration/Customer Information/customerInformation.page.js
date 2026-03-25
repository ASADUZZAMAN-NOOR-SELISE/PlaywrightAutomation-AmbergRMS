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

    this.editConfigBtn = page.getByRole("button", {
      name: "Edit Configuration",
    });
    this.submitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });

    this.alert = page.getByRole("alert");

    this.customerSection = page.locator("#customer_info");
    this.customerLogo = this.page.getByRole("img", {
      name: "logo",
      exact: true,
    });
    this.customerLogoInput = this.customerSection.getByText("Company Logo", {
      exact: true,
    });
    this.customerLogoUpload =
      this.customerSection.locator("input[type='file']");
  }

  getInputField(label) {
    return this.page.getByRole("textbox", { name: label });
  }

  getCustomerField(label) {
    return this.customerSection.getByLabel(label, { exact: true });
  }

  getText(value) {
    return this.page.getByText(value, { exact: true });
  }

  getCountryDropdown() {
    return this.page.locator(
      '[id="mui-component-select-CustomerInfo.Country"]',
    );
  }

  getOption(value) {
    return this.page.getByRole("option", { name: value });
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

  async editCustomerInformation(updatedData, filePath) {
    await this.editConfigBtn.click();

    const fields = [
      { name: "Company Name", value: updatedData.name },
      { name: "Street", value: updatedData.street },
      { name: "Town", value: updatedData.town },
      { name: "Postal Code", value: updatedData.postalCode },
      { name: "Region", value: updatedData.region },
      { name: "Telephone", value: updatedData.phone },
      { name: "Email", value: updatedData.email },
    ];

    for (const field of fields) {
      await this.getInputField(field.name).fill(field.value);
    }

    await this.getCountryDropdown().click();
    await this.getOption(updatedData.country).click();

    await expect(this.customerLogo).not.toBeVisible();
    await expect(this.customerLogoInput).toBeVisible();
    // await this.customerLogoUpload.setInputFiles(filePath);
    // await expect(this.customerLogo).toBeVisible();

    await this.submitBtn.click();

    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }

  async verifyUpdatedCustomerInformation(updatedData) {
    const updatedDataValues = [
      updatedData.name,
      updatedData.street,
      updatedData.town,
      updatedData.region,
      updatedData.postalCode,
      updatedData.phone,
      updatedData.country,
      updatedData.email,
    ];

    for (const value of updatedDataValues) {
      await expect(this.getText(value)).toHaveText(value);
    }
  }
}

export default CustomerInformationPage;

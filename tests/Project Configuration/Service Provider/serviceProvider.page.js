import { expect } from "@playwright/test";

const projectName = "dummy";
class ServiceProviderPage {
  constructor(page) {
    this.page = page;
    this.projectsHeading = page.getByRole("heading", { name: "Projects" });
    this.searchBox = page.getByRole("textbox", {
      name: "Search by Project Name",
    });
    this.projectName = page.getByLabel(projectName);
    this.projectLogo = page.getByRole("img", { name: "dummy" });
    this.projectConfig = page.getByText("Project Configuration");
    this.serviceProviderInfoBtn = page.getByRole("button", {
      name: "Service Provider",
    });

    this.editConfigBtn = page.getByRole("button", {
      name: "Edit Configuration",
    });
    this.submitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });

    this.alert = page.getByRole("alert");

    this.serviceProviderSection = page.locator("#service_provider");
    this.serviceProviderLogo = this.page.getByRole("img", {
      name: "logo",
      exact: true,
    });
    this.serviceProviderLogoInput = this.serviceProviderSection.getByText(
      "Company Logo",
      {
        exact: true,
      },
    );
    this.serviceProviderLogoUpload =
      this.serviceProviderSection.locator("input[type='file']");
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
      "//div[@id='mui-component-select-ServiceProviderInfo.Country']",
    );
  }

  getOption(value) {
    return this.page.getByRole("option", { name: value });
  }

  async navigateToServiceProviderInfo() {
    await expect(this.projectsHeading).toHaveText("Projects");
    await this.searchBox.click();
    await this.searchBox.fill(projectName);
    await this.projectName.click();
    await expect(this.projectLogo).toBeVisible();
    await await this.projectConfig.click();
    await this.serviceProviderInfoBtn.click();
  }

  async verifyServiceProviderInformation(serviceProviderData) {
    const serviceProviderFields = [
      { label: "CompanyName", value: serviceProviderData.name },
      { label: "Street", value: serviceProviderData.street },
      { label: "Town", value: serviceProviderData.town },
      { label: "Region", value: serviceProviderData.region },
      { label: "PostalCode", value: serviceProviderData.postalCode },
      { label: "Telephone", value: serviceProviderData.phone },
      { label: "Email", value: serviceProviderData.email },
    ];

    for (const field of serviceProviderFields) {
      const inputField = this.serviceProviderSection.getByLabel(field.label, {
        exact: true,
      });
      await expect(inputField).toBeVisible();
      await expect(
        this.serviceProviderSection.getByText(field.value, { exact: true }),
      ).toHaveText(field.value);
    }
  }

  async editServiceProviderInformation(updatedServiceProviderData, filePath) {
    await this.editConfigBtn.click();

    const fields = [
      { name: "Company Name", value: updatedServiceProviderData.name },
      { name: "Street", value: updatedServiceProviderData.street },
      { name: "Town", value: updatedServiceProviderData.town },
      { name: "Postal Code", value: updatedServiceProviderData.postalCode },
      { name: "Region", value: updatedServiceProviderData.region },
      { name: "Telephone", value: updatedServiceProviderData.phone },
      { name: "Email", value: updatedServiceProviderData.email },
    ];

    for (const field of fields) {
      await this.getInputField(field.name).fill(field.value);
    }

    await this.getCountryDropdown().click();
    await this.getOption(updatedServiceProviderData.country).click();

    await expect(this.serviceProviderLogo).not.toBeVisible();
    await expect(this.serviceProviderLogoInput).toBeVisible();
    // await this.serviceProviderLogoUpload.setInputFiles(filePath);
    // await expect(this.serviceProviderLogo).toBeVisible();

    await this.submitBtn.click();

    await expect(this.alert).toBeVisible();
    await expect(this.alert).toHaveText("Configuration updated successfully");
  }

  async verifyUpdatedServiceProviderInformation(updatedServiceProviderData) {
    const updatedDataValues = [
      updatedServiceProviderData.name,
      updatedServiceProviderData.street,
      updatedServiceProviderData.town,
      updatedServiceProviderData.region,
      updatedServiceProviderData.postalCode,
      updatedServiceProviderData.phone,
      updatedServiceProviderData.country,
      updatedServiceProviderData.email,
    ];

    for (const value of updatedDataValues) {
      await expect(this.getText(value)).toHaveText(value);
    }
  }
}

export default ServiceProviderPage;

class EditUnitPage {
  constructor(page) {
    this.page = page;
    this.settingsBtn = page.getByRole("button", { name: "Settings" });
    this.unitSettingsOption = page.getByRole("menuitem", {
      name: "Unit Settings",
    });
    this.editUnitSettingsBtn = page.getByRole("button", {
      name: "Edit Unit Settings",
    });
    this.templateMeterBtn = page.getByRole("button", {
      name: "Template Meter",
    });
    this.customSubmitBtn = page.getByRole("button", {
      name: "Custom Submit Button",
    });
  }

  async setUnitMeter() {
    await this.settingsBtn.click();
    await this.unitSettingsOption.click();
    await this.editUnitSettingsBtn.click();
    await this.templateMeterBtn.click();
    await this.customSubmitBtn.click();
  }
}

export default EditUnitPage;

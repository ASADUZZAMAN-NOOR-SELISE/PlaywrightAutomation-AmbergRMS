const { expect } = require('@playwright/test');
const { locator } = require('../../Utils/Locators/homeLocators');
const { assertions } = require('../../Utils/Assertions/assertion');
const { getUrl } = require('../../Utils/Urls/urls');

class LoginPage{
  constructor(page){
    this.page = page;
    this.logo = page.getByRole(locator.homeLogo.role).first();
    this.welcomeText = page.getByText(locator.homeWelcomeText.text);
    this.appTitle = page.getByText(locator.homeAppTitle.text);
    this.loginContainer = page.getByLabel(locator.homeLoginContainer.label);
    this.loginButton = page.getByRole(locator.homeLoginButton.role, { name: locator.homeLoginButton.name});
    this.logoutButton = page.getByRole(locator.homeLogoutButton.role, { name: locator.homeLogoutButton.name });
  }

  async goto() {
    await this.page.goto('/');
  }

  async verifyInitialState() {
    await this.logo.waitFor({ state: 'visible' });
    //await this.logo.click();
    await expect(this.logo).toBeVisible();
    //await expect(this.welcomeText).toHaveText(assertions.homepage.welcomeText);
  }

  async login() {
  await this.appTitle.waitFor({ state: 'visible' }); // wait first
  await this.appTitle.click();
  await expect(this.loginContainer).toContainText(assertions.homepage.releaseVersion);
  await expect(this.loginButton).toBeVisible();
  await this.loginButton.click();
}
  async logoutVisible(){
    await expect(this.page).toHaveURL(getUrl.urls.loginUrl)
    await expect(this.logoutButton).toBeVisible()
    
  }
}

module.exports = { LoginPage };
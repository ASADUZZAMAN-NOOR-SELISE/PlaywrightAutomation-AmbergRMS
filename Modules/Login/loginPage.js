import { locator } from '../../Utils/Locators/homeLocators';
import { assertions } from '../../Utils/Assertions/assertion';
import { getUrl } from '../../Utils/Urls/urls';
const { expect } = require('@playwright/test');

export class LoginPage{
  constructor(page){
    this.page = page;
    this.logo = page.getByRole(locator.homeLogo.role).first();
    this.welcomeText = page.getByRole(locator.homeWelcomeText.role);
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
    await expect(this.welcomeText).toContainText(assertions.homepage.welcomeText);
  }

  async login() {
    await this.appTitle.waitFor({ state: 'visible' }); 
    await this.appTitle.click();
    await expect(this.loginContainer).toContainText(assertions.homepage.releaseVersion);
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }
  async logoutVisible(){
    await expect(this.page).toHaveURL(getUrl.urls.loginUrl)
    await expect(this.logoutButton).toBeVisible()
  }
};
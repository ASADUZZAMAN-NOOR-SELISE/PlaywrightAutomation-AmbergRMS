const { LoginPage } = require('../../Utils/loginPage');
const { Common } = require('../../Utils/common');
class loginForAll {
    constructor(page) {
        this.page = page;
        this.loginPage = new LoginPage(page);
        this.common = new Common(page);
    }

    async loginforall() {

      await this.loginPage.goto();
      await this.page.locator(".MuiGrid-root").nth(1).isVisible();
      await this.loginPage.verifyInitialState();
      await this.loginPage.login();
      await this.loginPage.logoutVisible();
    }

}

module.exports = { loginForAll };
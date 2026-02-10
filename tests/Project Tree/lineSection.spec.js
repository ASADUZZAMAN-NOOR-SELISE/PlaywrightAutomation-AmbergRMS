const { test,expect } = require('@playwright/test');
const { LoginPage } = require('../../Utils/loginPage');
const { Common } = require('../../Utils/common');
const { data } = require('../../Utils/Data/Information');
const { projecTreetData } = require('./projectTree.data');
const { ProjectTreePage } = require('./projectTree.page');
let webContext;

test.beforeAll('Homepaeg to dashboard ', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  try {
    await loginPage.goto();
    //await page.locator('.MuiGrid-root').nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: 'login-failure.png', fullPage: true });
    console.error(' Login test failed:', error.message);
    throw error;
  }

  await context.storageState({ path: 'state.json' });
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test('Line section modal open @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projecTreetData.project.name);
  await common.submitProject();
  await common.searchProject(projecTreetData.project.name);
  await expect(page.getByLabel(projecTreetData.project.name).first()).toBeVisible();
  await common.enterIntoProject(projecTreetData.project.name);
  await expect(page.getByRole('heading', { name: projecTreetData.project.name })).toBeVisible();
  await tree.lineSectionTab.click();
  await expect(tree.lineSectionModal).toBeVisible();
  await tree.cancelBtn.isVisible();
  await tree.cancelBtn.click();

  ////////
  await common.deleteButton.isVisible();
  await common.deleteButton.click();
  await expect(page.locator("div[role='dialog']")).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).isVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
  const toast = page.getByText('Project deleted successfully');
  await expect(toast).toBeVisible();
  await expect(page.getByRole('alert').first()).toContainText('Project deleted successfully');
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");

  await page.reload();
  const projectNames = page.locator('tbody tr td:first-child span');
  const count = await projectNames.count();
  for (let i = 0; i < count; i++) {
    console.log(await projectNames.nth(i).innerText());
    if ((await projectNames.nth(i).innerText()) === projecTreetData.project.name) {
      throw new Error('Project still exists after deletion');
    }
  }
});



test('Line section Add @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projecTreetData.project.name);
  await common.submitProject();
  await common.searchProject(projecTreetData.project.name);
  await expect(page.getByLabel(projecTreetData.project.name).first()).toBeVisible();
  await common.enterIntoProject(projecTreetData.project.name);
  await expect(page.getByRole('heading', { name: projecTreetData.project.name })).toBeVisible();
  await tree.addLine();
  await tree.submitLineSectionBtn.isVisible();
  await tree.submitLineSectionBtn.click();

  //////////
  await common.deleteButton.isVisible();
  await common.deleteButton.click();
  await expect(page.locator("div[role='dialog']")).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).isVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
  const toast = page.getByText('Project deleted successfully');
  await expect(toast).toBeVisible();
  await expect(page.getByRole('alert').first()).toContainText('Project deleted successfully');
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");

  await page.reload();
  const projectNames = page.locator('tbody tr td:first-child span');
  const count = await projectNames.count();
  for (let i = 0; i < count; i++) {
    console.log(await projectNames.nth(i).innerText());
    if ((await projectNames.nth(i).innerText()) === projecTreetData.project.name) {
      throw new Error('Project still exists after deletion');
    }
  }
});

test('Line Section Cancel function @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projecTreetData.project.name);
  await common.submitProject();
  await common.searchProject(projecTreetData.project.name);
  await expect(page.getByLabel(projecTreetData.project.name).first()).toBeVisible();
  await common.enterIntoProject(projecTreetData.project.name);
  await expect(page.getByRole('heading', { name: projecTreetData.project.name })).toBeVisible();
  await tree.addLine();
  await tree.cancelBtn.isVisible();
  await tree.cancelBtn.click();
  await expect(tree.cancelModal).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).click();

  ////////
  await common.deleteButton.isVisible();
  await common.deleteButton.click();
  await expect(page.locator("div[role='dialog']")).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).isVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
  const toast = page.getByText('Project deleted successfully');
  await expect(toast).toBeVisible();
  await expect(page.getByRole('alert').first()).toContainText('Project deleted successfully');
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");

  await page.reload();
  const projectNames = page.locator('tbody tr td:first-child span');
  const count = await projectNames.count();
  for (let i = 0; i < count; i++) {
    console.log(await projectNames.nth(i).innerText());
    if ((await projectNames.nth(i).innerText()) === projecTreetData.project.name) {
      throw new Error('Project still exists after deletion');
    }
  }
});



const { test,expect } = require('@playwright/test');
const { LoginPage } = require('../../Utils/loginPage');
const { Common } = require('../../Utils/common');
const { data } = require('../../Utils/Data/Information');
const { projecTreetData } = require('./projectTree.data');
const { ProjectTreePage } = require('./projectTree.page');

let webContext;

function getUniqueProjectName(prefix = 'Line') {
  return `${prefix}-${Date.now()}`;
}
const projectName = getUniqueProjectName();

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

test('Line section modal open @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.lineSectionTab.click();
  await expect(tree.lineSectionModal).toBeVisible();

});


test('Line section Add @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.click();
  await page.reload();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await expect(lineSection1).toBeVisible();

});

test('Line Section Cancel function @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line cancel ");
  await tree.cancelBtn.isVisible();
  await tree.cancelBtn.click();
  await expect(tree.cancelModal).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
});

test('Line section Edit modal open @SANITY ', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await expect(lineSection1).toBeVisible();
  await lineSection1.click();
  await tree.editIcon.click();
  await expect(tree.lineSectionModal).toBeVisible();
  
});

test('Line section Drawer open @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await expect(lineSection1).toBeVisible();
  await lineSection1.click();
  await expect(tree.sectionProperty).toBeVisible();
  await expect(tree.editIcon).toBeVisible();
  
});

test('Line section edit all and save @SANITY', async ({}) => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await expect(lineSection1).toBeVisible();
  await lineSection1.click();
  await expect(tree.sectionProperty).toBeVisible();
  await expect(tree.editIcon).toBeVisible();
  await tree.editIcon.click();
  await tree.editLine();
  await tree.submitLineSectionBtn.click();
  await expect(page.getByRole('alert').first()).toContainText('edited successfully');

});

test('Line section edit all and cancel @SANITY ', async ({}) => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await page.reload();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await lineSection1.isVisible();
  await lineSection1.click();
  await expect(tree.editIcon).toBeVisible();
  await tree.editIcon.click();
  await tree.editLine();
  await tree.cancelBtn.isVisible();
  await tree.cancelBtn.click();
  await expect(tree.cancelModal).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).click();

});


test('Delete : Line section modal > cancel @SANITY @one', async ({}) => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await page.reload();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await lineSection1.isVisible();
  await lineSection1.click();
  await tree.deleteIcon.isVisible();
  await tree.deleteIcon.click();
  await expect(tree.deleteModal).toBeVisible();
  await tree.cancelBtn.click();
  await expect(tree.deleteModal).not.toBeVisible();

});

test("Delete : Line section modal > confirm @SANITY ", async ({}) => {

  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  
  await loginPage.goto();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await page.reload();
  const lineSection1 = page.locator("div[aria-label='Generic Tree'] ul li").filter({ hasText: 'Line section 1' });
  await lineSection1.isVisible();
  await lineSection1.click();
  await tree.deleteIcon.isVisible();
  await tree.deleteIcon.click();
  await expect(tree.deleteModal).toBeVisible();
  await tree.deleteIcon.click();
  await expect(tree.deleteModal).toBeVisible();
  await tree.modalConfirmBtn.isVisible();
  await tree.modalConfirmBtn.click();
  await expect(page.getByRole('alert').first()).toContainText(' deleted successfully');
  await expect(page.locator('.MuiTreeItem-iconContainer').first()).not.toBeVisible();
  await page.reload();

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
    if ((await projectNames.nth(i).innerText()) === projectName) {
      throw new Error('Project still exists after deletion');
    }
  }
});

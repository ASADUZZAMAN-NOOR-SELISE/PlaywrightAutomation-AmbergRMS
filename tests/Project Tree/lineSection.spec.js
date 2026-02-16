const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../Utils/loginPage';
import { Common } from '../../Utils/common';
import { data } from '../../Utils/Data/Information';
import { projecTreetData } from './projectTree.data';
import { ProjectTreePage } from './projectTree.page';

let webContext;

function getUniqueProjectName(prefix = 'Line') {
  return `${prefix}-${Date.now()}`;
}


test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  try {
    await loginPage.goto();
    await page.locator(".MuiGrid-root").nth(1).isVisible();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await page.reload(); // Ensure the page is fully loaded after login
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: "login-failure.png", fullPage: true });
    console.error("Login test failed:", error.message);
    throw error;
  }

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test('Line section modal open @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();
  
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
  const projectName = getUniqueProjectName();

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.isVisible();
  await tree.submitLineSectionBtn.click();
  await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  
});

test('Line Section Cancel function @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
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
  const projectName = getUniqueProjectName();
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.isVisible();
  await tree.submitLineSectionBtn.click();
  await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  await page.reload();

  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

  await tree.editIcon.click();
  await expect(tree.lineSectionModal).toBeVisible();
  
});

test('Line section Drawer open @SANITY', async ({})  => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.isVisible();
  await tree.submitLineSectionBtn.click();
  await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  await page.reload();
  //linesection delete icon is not visible after first time delete, so added reload and click again to make it visible and then delete the line section
  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

  await expect(tree.sectionProperty).toBeVisible();
  await expect(tree.editIcon).toBeVisible();
  
});

test('Line section edit all and save @SANITY', async ({}) => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.click();
  await page.reload();
  //linesection delete icon is not visible after first time delete, so added reload and click again to make it visible and then delete the line section
  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
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
  const projectName = getUniqueProjectName();
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.click();
  await page.reload();
  //linesection delete icon is not visible after first time delete, so added reload and click again to make it visible and then delete the line section
  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await expect(tree.sectionProperty).toBeVisible();
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
  const projectName = getUniqueProjectName();
  

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.click();
  await page.reload();
  
  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

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
  const projectName = getUniqueProjectName();
  
  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectName);
  await common.submitProject();
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
  await common.enterIntoProject(projectName);
  await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  await tree.addLine("Line section 1");
  await tree.submitLineSectionBtn.click();
  
  //linesection delete icon is not visible after first time delete, so added reload and click again to make it visible and then delete the line section
  const lineSection = page.locator("//div[@class='css-g7taw0']").first();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

  await tree.deleteIcon.isVisible();
  await tree.deleteIcon.click();
  await expect(tree.deleteModal).toBeVisible();
  await tree.modalConfirmBtn.isVisible();
  await tree.modalConfirmBtn.click();
  await expect(page.getByRole('alert').first()).toContainText('Line section deleted successfully');

  await page.reload();
  await common.deleteButton.isVisible();
  await common.deleteButton.click();
  await expect(page.locator("div[role='dialog']")).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).isVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
  const toast = page.getByText('Project deleted successfully');
  await expect(toast).toBeVisible();
  await expect(toast).toContainText('Project deleted successfully');
  await expect(page).toHaveURL("https://dev-amberg.seliselocal.com/projects");
  
});
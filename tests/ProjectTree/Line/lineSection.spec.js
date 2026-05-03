const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../../Utils/loginPage';
import { Common } from '../../../Utils/common';
import { projecTreetData } from '../projectTree.data';
import { ProjectTreePage } from '../projectTree.page';

let webContext;

function getUniqueProjectName(prefix = 'Line') {
  return `${prefix}-${Date.now()}`;
}

test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  //await page.locator(".MuiGrid-root").nth(1).isVisible();
  await loginPage.verifyInitialState();
  await loginPage.login();
  await loginPage.logoutVisible();

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test('GIVEN a new project is created, WHEN the user opens the line section tab, THEN the line section modal is displayed', async ({}) => {

  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  await test.step('GIVEN a new project is created', async () => {
    await loginPage.goto();
    await common.clickNewProject();
    await common.setProjectName(projectName);
    await common.submitProject();
    await common.searchProject(projectName);
    await expect(page.getByLabel(projectName).first()).toBeVisible();
    await common.enterIntoProject(projectName);
    await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  });

  await test.step('WHEN the user opens the line section tab', async () => {
    await tree.lineSectionTab.click();
  });

  await test.step('THEN the line section modal is displayed', async () => {
    await expect(tree.lineSectionModal).toBeVisible();
  });

  await test.step('CLEANUP delete created project', async () => {
    await page.getByTestId("ClearIcon").click();
    await page.reload();
    await page.getByRole('heading').click();
    await page.getByTestId("DeleteIcon").click({ timeout: 1000 });
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  });

});

test('GIVEN a new project is created, WHEN the user adds a line section, THEN the line section is successfully created @SANITY', async ({}) => {

  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  await test.step('GIVEN a new project is created', async () => {
    await loginPage.goto();
    await common.clickNewProject();
    await common.setProjectName(projectName);
    await common.submitProject();
    await common.searchProject(projectName);
    await expect(page.getByLabel(projectName).first()).toBeVisible();
    await common.enterIntoProject(projectName);
    await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  });

  await test.step('WHEN the user adds a line section', async () => {
    await tree.addLine("Line section 1");
    await expect(tree.submitLineSectionBtn).toBeVisible();
    await tree.submitLineSectionBtn.click();
  });

  await test.step('THEN the line section is successfully created', async () => {
    // Uncomment if toast is stable
    await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  });

  await test.step('CLEANUP delete created project', async () => {
    await page.getByTestId('ArrowBackIcon').click();
    await common.searchProject(projectName);
    await expect(page.getByLabel(projectName).first()).toBeVisible();
    await common.enterIntoProject(projectName);
    await page.getByTestId("DeleteIcon").click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("alert"))
      .toContainText("Project deleted successfully");
  });

});

test('GIVEN a new project is created, WHEN the user clicks cancel on line section add modal, THEN the cancel confirmation modal is confirmed and the add modal is closed @SANITY', async ({}) => {

  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  await test.step('GIVEN a new project is created', async () => {
    await loginPage.goto();
    await common.clickNewProject();
    await common.setProjectName(projectName);
    await common.submitProject();
    await common.searchProject(projectName);
    await expect(page.getByLabel(projectName).first()).toBeVisible();
    await common.enterIntoProject(projectName);
    await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
  });

  await test.step('WHEN the user opens line section add modal AND the user clicks cancelAND confirms the cancel action', async () => {
    await tree.addLine("Line section 1");
    await expect(tree.cancelBtn).toBeVisible(); // fixed
    await tree.cancelBtn.click();
    await expect(tree.cancelModal).toBeVisible();
    await page.getByRole('button', { name: /confirm/i }).click();
  });

  await test.step('THEN the add line section modal is closed', async () => {
    await expect(tree.lineSectionModal).toBeHidden();
  });

  await test.step('CLEANUP delete created project', async () => {
    await page.reload();
    await page.getByRole('heading').click();
    await page.getByTestId("DeleteIcon").click({ timeout: 1000 });
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(page.getByRole("alert").first())
      .toContainText("Project deleted successfully");
  });

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
 // await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  await page.reload();

  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

  // edit icon 
  await tree.editIcon.click();
  await expect(tree.lineSectionModal).toBeVisible();
  await page.getByTestId("ClearIcon").isEnabled();
  await page.getByTestId("ClearIcon").click();

  // //line delete  
  // await page.getByTestId("DeleteIcon").isEnabled();
  // await page.getByTestId("DeleteIcon").click();
  // await page.getByRole("button", {name : "Confirm"}).isEnabled();
  // await page.getByRole("button", {name : "Confirm"}).click();
  // //await expect(page.getByRole("alert")).toContainText("Line section deleted successfully")

  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
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
 // await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
  await page.reload();

  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();

  // //line delete  
  // await page.getByTestId("DeleteIcon").isEnabled();
  // await page.getByTestId("DeleteIcon").click();
  // await page.getByRole("button", {name : "Confirm"}).isEnabled();
  // await page.getByRole("button", {name : "Confirm"}).click();
  // //await expect(page.getByRole("alert").first()).toContainText("Line section deleted successfully")

 //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  
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
  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
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

  
  //await expect(page.getByRole("alert").first()).toContainText("Line section deleted successfully")

  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  // const projectLocator = page.getByText('Project', { exact: true });
  // if(projectLocator){
  //   await page.getByRole('heading').click();
  //   await page.getByTestId("DeleteIcon").isEnabled();
  //   await page.getByTestId("DeleteIcon").click({timeout:1000});
  //   await page.getByRole("button", {name : "Confirm"}).isEnabled();
  //   await page.getByRole("button", {name : "Confirm"}).click();
  //   await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  // }
  // else{
  //   //line delete  
  //   await page.getByTestId("DeleteIcon").isEnabled();
  //   await page.getByTestId("DeleteIcon").click({timeout:1000});
  //   await page.getByRole("button", {name : "Confirm"}).isEnabled();
  //   await page.getByRole("button", {name : "Confirm"}).click();

  //   //project delete
  //   await page.reload();
  //   await page.getByRole('heading').click();
  //   await page.getByTestId("DeleteIcon").isEnabled();
  //   await page.getByTestId("DeleteIcon").click({timeout:1000});
  //   await page.getByRole("button", {name : "Confirm"}).isEnabled();
  //   await page.getByRole("button", {name : "Confirm"}).click();
  //   await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  // }
 

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
  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
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

//   //line delete  
//   await page.getByTestId("DeleteIcon").isEnabled();
//   await page.getByTestId("DeleteIcon").click();
//   await page.getByRole("button", {name : "Confirm"}).isEnabled();
//   await page.getByRole("button", {name : "Confirm"}).click();
//  // await expect(page.getByRole("alert").first()).toContainText("Line section deleted successfully")

  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");

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
  
  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
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

  // //line delete  
  // await page.getByTestId("DeleteIcon").isEnabled();
  // await page.getByTestId("DeleteIcon").click();
  // await page.getByRole("button", {name : "Confirm"}).isEnabled();
  // await page.getByRole("button", {name : "Confirm"}).click();
  // //await expect(page.getByRole("alert").first()).toContainText("Line section deleted successfully")

  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");

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
  const lineSection = page.getByTestId("line-section-tree-testid-child-0");
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click();
  await page.reload();
  await lineSection.waitFor("networkidle");
  await lineSection.waitFor({ state: 'visible' });
  await lineSection.isEnabled();
  await lineSection.click({ force: true });
  await expect(page.getByText('Line Section', { exact: true })).toBeVisible();
  await tree.deleteIcon.isVisible();
  await tree.deleteIcon.click();
  await expect(tree.deleteModal).toBeVisible();
  await tree.modalConfirmBtn.isVisible();
  await tree.modalConfirmBtn.click();
  await expect(page.getByRole("alert").first()).toHaveText("Line section deleted successfully");
  // project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  
});
test('Line section all test coverage @SANITY', async ({})  => {
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

  await tree.exploreLineTest();
  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
  

});
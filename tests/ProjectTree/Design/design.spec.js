const { test, expect } = require('@playwright/test');
import { DesignPage } from '../Design/design.page';
import { LoginPage } from '../../../Utils/loginPage';
import { Common } from '../../../Utils/common';
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

test('Add new design', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
});

test('Add design > cross when no data', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();
  await design.clickAddDesign();
  
  await design.crossBtn.click();
  //await expect(page.locator(".project-tree-design")).not.toBeVisible()
});

test('Add design > cancel when no data', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();
  await design.clickAddDesign();
  
  await design.cancelBtn.click();
  //await expect(page.locator(".project-tree-design")).not.toBeVisible()
});

test('Add design > cross when data > modal cross', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();
  await design.clickAddDesign();
  //fill data
  await design.fillName("Design 1");

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCrossBtn.last().click();

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCancelBtn.last().click();

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await page.getByRole('button', { name: /confirm/i }).click();
  
});

test('Add design > cancel when data > modal cross', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();
  await design.clickAddDesign();
  //fill data
  await design.fillName("Design 1");

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCrossBtn.last().click();

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCancelBtn.last().click();

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await page.getByRole('button', { name: /confirm/i }).click();
  
});


test('Edit design > Confirm ', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  //edit design 
  await design.editBtn.click();
  // fill form
  await design.fillName("Design 2");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(16);
  await design.fillComment("Design 2 comment");
  await design.submitDesign();
  await expect(page.getByRole("alert").first()).toContainText(/edited successfully/i);

  await design.verifyDesignCreated(
    "Design 2",
    "Design 2 comment",
    //"2026.05.16"
  );

});

test('Edit design > cancel > when no edit', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  //edit 
  await design.editBtn.click();
  await design.crossBtn.first().click();
  //await expect(page.locator(".project-tree-design")).not.toBeVisible()
});

test('Edit design > cross > when no edit', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  //edit 
  await design.editBtn.click();
  await design.cancelBtn.first().click();
 // await expect(page.locator(".project-tree-design")).not.toBeVisible()
});

test('Edit design > cancel when edit data ', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  //edit design 
  await design.editBtn.click();
  // fill form
  await design.fillName("Design 2");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(16);
  await design.fillComment("Design 2 comment");

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCrossBtn.last().click();

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCancelBtn.last().click();

  await design.cancelBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await page.getByRole('button', { name: /confirm/i }).click();

});

test('Edit design > cross when edit data ', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  //edit design 
  await design.editBtn.click();
  // fill form
  await design.fillName("Design 2");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(16);
  await design.fillComment("Design 2 comment");

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCrossBtn.last().click();

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await design.modalCancelBtn.last().click();

  await design.crossBtn.first().click()
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await page.getByRole('button', { name: /confirm/i }).click();

});

test('delete design', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const design = new DesignPage(page);
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

  // add design
  await expect(page.locator(".project-tree-design")).toBeVisible();

  await design.clickAddDesign();

  // validation
  await design.submitEmptyForm();
  await design.verifyNameRequired();

  // fill form
  await design.fillName("Design 1");
  await design.openCalendar();
  await design.goToNextMonth();
  await design.selectDate(15);
  await design.fillComment("Design 1 comment");

  // submit
  await design.submitDesign();
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );

  await design.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await design.modalCancelBtn.click();

  await design.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await design.modalCrossBtn.last().click();

  await design.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await page.getByRole('button', { name: /confirm/i }).click();
});
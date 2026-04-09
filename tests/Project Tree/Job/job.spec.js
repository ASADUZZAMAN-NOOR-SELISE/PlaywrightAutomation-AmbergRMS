const { test, expect } = require('@playwright/test');
import { JobPage } from '../Job/job.page';
import { LoginPage } from '../../../Utils/loginPage';
import { Common } from '../../../Utils/common';
import { ProjectTreePage } from '../projectTree.page';
import path from 'path';

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

test('Add new job', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();

  // validation
  await job.submitEmptyForm();
  await job.verifyNameRequired();

  // fill form
  await job.fillName("Job 1");
  await job.fillComment("Job 1 comment");

  // submit
  await job.submitJob();
  
  // verification
  await job.verifyJobCreated(
    "Job 1",
    "Job 1 comment",
    "Design 1"
  );
});

test('Add job > cross when no data', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();
  await job.clickCrossBtn();
  await expect(page.getByTestId("add-job-section-drawer-test-id")).not.toBeVisible();
});

test('Add job > cancel when no data', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();
  await job.clickCancelBtn();
  await expect(page.getByTestId("add-job-section-drawer-test-id")).not.toBeVisible();
});

test('Add job > cross button confirmation modal', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();

  // fill some data to trigger confirmation
  await job.fillName("Job 1");

  // test cross button with confirmation modal
  await job.crossBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalCrossBtn.last().click();

  await job.crossBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalCancelBtn.click();

  await job.crossBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalConfirmBtn.click();
});

test('Add job > cancel button confirmation modal', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();

  // fill some data to trigger confirmation
  await job.fillName("Job 1");

  // test cancel button with confirmation modal
  await job.cancelBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalCrossBtn.last().click();

  await job.cancelBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalCancelBtn.click();

  await job.cancelBtn.first().click();
  await expect(page.getByText("Please confirm your action ")).toBeVisible();
  await job.modalConfirmBtn.click();
});

test('delete job', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();

  // fill form
  await job.fillName("Job 1");
  await job.fillComment("Job 1 comment");

  // submit
  await job.submitJob();
  
  // verification
  await job.verifyJobCreated(
    "Job 1",
    "Job 1 comment",
    "Design 1"
  );

  await job.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await job.modalCancelBtn.click();

  await job.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await job.modalCrossBtn.last().click();

  await job.deleteBtn.click();
  await expect(page.getByText("The selected entry will be deleted")).toBeVisible();
  await job.modalConfirmBtn.click();
  await expect(page.getByRole("alert").first()).toHaveText("Job deleted successfully")
});

test('Import measurment from source folder ', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  const filePath = 'tests/Project Tree/Job/Measurment/09 Abs S_2023-10-11_112745.rmsmeas';
  
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();
  // fill form
  await job.fillName("Job 1");
  await job.fillComment("Job 1 comment");
  // submit
  await job.submitJob();
  
  // import measurment 
  await page.getByTestId('MoreVertIcon').click();
  await expect(page.getByText('Import from AmbergRail')).toBeVisible();
  await page.getByText('Import from AmbergRail').click();

  // Ensure upload icon is ready
  const uploadBtn = page.getByAltText('upload icon');
  await expect(uploadBtn).toBeEnabled();

  // Start listener BEFORE click
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    uploadBtn.click()
  ]);

  await fileChooser.setFiles(path.resolve(filePath));
  await expect(page.getByText("This is a new measurement")).toBeVisible();
  await expect(await page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByRole("alert").last()).toContainText("Import of the 09 Abs S_2023-10-11_11274… measurement successful. Please reload the views")
  await page.reload();
  await expect(page.locator(".project-tree-job li")).toBeVisible();
  await page.locator(".project-tree-job li").click();
  await expect(page.getByText('2023-10-11 15:27:45', { exact: true })).toBeVisible();
  await page.getByText('2023-10-11 15:27:45', { exact: true }).click();
  await expect(page.getByTestId("custom-side-bar").getByText("Measurement")).toBeVisible();

});


test('Import measurment from another project', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  const filePath = 'tests/Project Tree/Job/Measurment/09 Abs S_2023-10-11_112745.rmsmeas';
  
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();
  // fill form
  await job.fillName("Job 1");
  await job.fillComment("Job 1 comment");
  // submit
  await job.submitJob();
  
  // import measurment 
  //await page.getByTestId('MoreVertIcon').click();
  await page.getByTestId('job-tree-testid-child-0').getByRole('button', { name: 'more' }).click();
  await expect(page.getByRole('menu')).toContainText('Import from AmbergRail');
  await expect(page.getByRole('menu')).toContainText('Import from another project');
  await page.getByRole('menuitem', { name: 'Import from another project' }).click();
  await expect(page.getByText('Niederhasli')).toBeVisible();
  await page.getByLabel('Niederhasli').getByRole('checkbox').check();
  await page.getByRole('listitem').filter({ hasText: '2010 up' }).getByTestId('ExpandMoreIcon').click();
  await expect(page.getByText('-02-23 18:00:02')).toBeVisible();
  await page.getByLabel('-02-23 18:00:02').getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByRole('alert').last()).toContainText('Importing of the 2024-02-23 18:00:02 measurement in progress. We will notify you when data is ready to be used.');
  await expect(page.getByRole('alert').last()).toContainText('Import of the 2024-02-23 12:00:02 measurement successful. Please reload the views.');
  await page.reload();
  await expect(page.locator(".project-tree-job li")).toBeVisible();
  await page.locator(".project-tree-job li").click();
  await expect(page.getByTestId('job-tree-testid-child-0')).toContainText('2024-02-23 18:00:02');
  await page.getByText('2024-02-23 18:00:02').click();
  await expect(page.getByTestId("custom-side-bar").getByText("Measurement")).toBeVisible();

});


test('Import existing measurment from another project : Measurement already exists', async ({}) => {
  const page = await webContext.newPage();
  
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const job = new JobPage(page);
  const tree = new ProjectTreePage(page);
  const projectName = getUniqueProjectName();

  const filePath = 'tests/Project Tree/Job/Measurment/09 Abs S_2023-10-11_112745.rmsmeas';
  
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
  await page.locator(".project-tree-design").getByText("Add Design").click();
  await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
  await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
  await page.getByTestId("CalendarIcon").click();
  await page.getByTestId("ArrowRightIcon").click();
  await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByTestId('design-tree-testid')).toBeVisible();

  // add job
  await expect(page.locator(".project-tree-job")).toBeVisible();
  await job.clickAddJob();
  // fill form
  await job.fillName("Job 1");
  await job.fillComment("Job 1 comment");
  // submit
  await job.submitJob();
  
  // import measurment 
  //await page.getByTestId('MoreVertIcon').click();
  await page.getByTestId('job-tree-testid-child-0').getByRole('button', { name: 'more' }).click();
  await expect(page.getByRole('menu')).toContainText('Import from AmbergRail');
  await expect(page.getByRole('menu')).toContainText('Import from another project');
  await page.getByRole('menuitem', { name: 'Import from another project' }).click();
  await expect(page.getByText('Niederhasli')).toBeVisible();
  await page.getByLabel('Niederhasli').getByRole('checkbox').check();
  await page.getByRole('listitem').filter({ hasText: '2010 up' }).getByTestId('ExpandMoreIcon').click();
  await expect(page.getByText('-02-23 18:00:02')).toBeVisible();
  await page.getByLabel('-02-23 18:00:02').getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByRole('alert').last()).toContainText('Importing of the 2024-02-23 18:00:02 measurement in progress. We will notify you when data is ready to be used.');
  await expect(page.getByRole('alert').last()).toContainText('Import of the 2024-02-23 12:00:02 measurement successful. Please reload the views.');
  await page.reload();
  await expect(page.locator(".project-tree-job li")).toBeVisible();
  await page.locator(".project-tree-job li").click();
  await expect(page.getByTestId('job-tree-testid-child-0')).toContainText('2024-02-23 18:00:02');

  // again import same file for existing validation check for same file 
  await await page.getByTestId('MoreVertIcon').click();
  await expect(page.getByRole('menu')).toContainText('Import from AmbergRail');
  await expect(page.getByRole('menu')).toContainText('Import from another project');
  await page.getByRole('menuitem', { name: 'Import from another project' }).click();
  await expect(page.getByText('Niederhasli')).toBeVisible();
  await page.getByLabel('Niederhasli').getByRole('checkbox').check();
  await page.getByRole('listitem').filter({ hasText: '2010 up' }).getByTestId('ExpandMoreIcon').click();
  await expect(page.getByText('-02-23 18:00:02')).toBeVisible();
  await page.pause();
  await page.getByLabel('-02-23 18:00:02').getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.locator("div [aria-label='Selected Measurements']").getByText("Measurement already exists")).toBeVisible();
});
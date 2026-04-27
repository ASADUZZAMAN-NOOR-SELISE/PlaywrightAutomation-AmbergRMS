const { test, expect } = require('@playwright/test');
import { JobPage } from '../ProjectTree/Job/job.page';
import { LoginPage } from '../../Utils/loginPage';
import { Common } from '../../Utils/common';
import { ProjectTreePage } from '../ProjectTree/projectTree.page';
//import path from 'path';
import { loginForAll } from '../Logedin/loginForAll.page';
import { ChartPage } from './chart.page';

let webContext;

// // function getUniqueProjectName(prefix = 'Line') {
// //   return `${prefix}-${Date.now()}`;
// // }

test.beforeAll("Navigated to dashboard", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginForAllPage = new loginForAll(page);

  await loginForAllPage.loginforall();
  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});


// test('Import measurment from source folder ', async ({}) => {

//   const page = await webContext.newPage();
  
//   const loginPage = new LoginPage(page);
//   const common = new Common(page);
//   const job = new JobPage(page);
//   const tree = new ProjectTreePage(page);
//   const projectName = getUniqueProjectName();

//   const filePath = 'tests/Project Tree/Job/Measurment/09 Abs S_2023-10-11_112745.rmsmeas';
  
//   await loginPage.goto();
//   await common.clickNewProject();
//   await common.setProjectName(projectName);
//   await common.submitProject();
//   await common.searchProject(projectName);
//   await expect(page.getByLabel(projectName).first()).toBeVisible();
//   await common.enterIntoProject(projectName);
//   await expect(page.getByRole('heading', { name: projectName })).toBeVisible();
//   await tree.addLine("Line section 1");
//   await tree.submitLineSectionBtn.isVisible();
//   await tree.submitLineSectionBtn.click();
//   await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');

//   // add track 
//   await page.getByTestId('ChevronRightIcon').click();
//   await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
//   await page.getByRole('button', { name: 'AddTrackButton' }).click();
//   await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
//   await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();

//   // add track 
//   await page.getByRole('textbox', { name: 'NameInput' }).click();
//   await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
//   await page.getByRole('textbox', { name: 'Number' }).click();
//   await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
//   await page.getByRole('textbox', { name: 'Comment' }).click();
//   await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
//   await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
//   await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
//   await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
//   await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

//   // add design
//   await expect(page.locator(".project-tree-design")).toBeVisible();
//   await page.locator(".project-tree-design").getByText("Add Design").click();
//   await expect(page.getByTestId("add-design-section-drawer-test-id")).toBeVisible();
//   await page.getByRole('textbox', { name: 'name' }).fill('Design 1');
//   await page.getByTestId("CalendarIcon").click();
//   await page.getByTestId("ArrowRightIcon").click();
//   await page.locator("div[role='row'] button").filter({ hasText: '15' }).first().click();
//   await page.getByRole('textbox', { name: 'Comment' }).fill('Design 1 comment');
//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
//   await expect(page.getByTestId('design-tree-testid')).toBeVisible();

//   // add job
//   await expect(page.locator(".project-tree-job")).toBeVisible();
//   await job.clickAddJob();
//   // fill form
//   await job.fillName("Job 1");
//   await job.fillComment("Job 1 comment");
//   // submit
//   await job.submitJob();
  
//   // import measurment 
//   await page.getByTestId('MoreVertIcon').click();
//   await expect(page.getByText('Import from AmbergRail')).toBeVisible();
//   await page.getByText('Import from AmbergRail').click();

//   // Ensure upload icon is ready
//   const uploadBtn = page.getByAltText('upload icon');
//   await expect(uploadBtn).toBeEnabled();

//   // Start listener BEFORE click
//   const [fileChooser] = await Promise.all([
//     page.waitForEvent('filechooser'),
//     uploadBtn.click()
//   ]);

//   await fileChooser.setFiles(path.resolve(filePath));
//   await expect(page.getByText("This is a new measurement")).toBeVisible();
//   await expect(await page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();

//   await page.getByRole('button', { name: 'Custom Submit Button' }).click();
//   await expect(page.getByRole("alert").last()).toContainText("Import of the 09 Abs S_2023-10-11_11274… measurement successful. Please reload the views")
//   await page.reload();
//   await expect(page.locator(".project-tree-job li")).toBeVisible();

//   await page.locator(".project-tree-job li").click();
//   await expect(page.getByText('2023-10-11 15:27:45', { exact: true })).toBeVisible();
//   await page.getByText('2023-10-11 15:27:45', { exact: true }).click();
//   await expect(page.getByTestId("custom-side-bar").getByText("Measurement")).toBeVisible();

// });


test('Chart Filter', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const project = new Project(page);
  
  await loginPage.goto();
  await page.locator("tbody tr").first().isVisible();
  await page.locator("tbody tr").first().click();
 
});
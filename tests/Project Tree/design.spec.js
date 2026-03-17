const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../Utils/loginPage';
import { Common } from '../../Utils/common';
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

  await loginPage.goto();
  //await page.locator(".MuiGrid-root").nth(1).isVisible();
  //await page.getByRole('button', { name: 'Close' }).click();
  await loginPage.verifyInitialState();
  await loginPage.login();
  await loginPage.logoutVisible();

  await context.storageState({ path: "state.json" });
  webContext = await browser.newContext({ storageState: "state.json" });
});

test('Track add @SANITY', async ({})  => {
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

  // add track 
  await page.getByTestId('ChevronRightIcon').click();
  await expect(page.getByRole('button', { name: 'AddTrackButton' })).toBeVisible();
  await page.getByRole('button', { name: 'AddTrackButton' }).click();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();

  // name field required assertion
  await expect(page.getByLabel('Name Input Error Message')).toContainText('Name is required');

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
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track 1').click();
  // add design 
  
  
 
  // track delete 
  await page.getByTestId("line-section-tree-testid-child-0").isEnabled();
  await page.getByTestId("line-section-tree-testid").getByText("New Edited track 2").click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click();
  const confirmBtn = page.getByRole('button', { name: 'confirm' });
  await confirmBtn.waitFor({ state: 'visible' });
  await confirmBtn.click({ force: true });
  await page.getByRole("alert").first().waitFor({state: "visible"});
  expect(await page.getByRole("alert").first()).toHaveText("Track deleted successfully")
  await expect(page.getByTestId("line-section-tree-testid").getByText("New Edited track 2")).not.toBeVisible();

  //project delete
  await page.reload();
  await page.getByRole('heading').click();
  await page.getByTestId("DeleteIcon").isEnabled();
  await page.getByTestId("DeleteIcon").click({timeout:1000});
  await page.getByRole("button", {name : "Confirm"}).isEnabled();
  await page.getByRole("button", {name : "Confirm"}).click();
  await expect(page.getByRole("alert").first()).toContainText("Project deleted successfully");
});
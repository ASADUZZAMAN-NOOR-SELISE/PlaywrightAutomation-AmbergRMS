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
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
  await expect(page.getByText('Track', { exact: true })).toBeVisible();

  // assertion after track create


  // track edit 
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 2");
  const editTrackName = await page.getByRole('textbox', { name: 'NameInput' }).inputValue();
  expect(editTrackName).toBe("New Edited track 2");

  await page.getByRole('textbox', { name: 'Number' }).fill("12345");
  const editNumber = await page.getByRole('textbox', { name: 'Number' }).inputValue();
  expect(editNumber).toBe("12345")

  await page.getByRole('textbox', { name: 'Comment' }).fill("Edit comment");
  const editComment = await page.getByRole('textbox', { name: 'Comment' }).inputValue();
  expect(editComment).toBe("Edit comment");

  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).clear();
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill("200");
  const startLocalization = await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).inputValue();
  expect(startLocalization).toBe("200");

  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).clear();
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill("99999999");
  const endLocalization = await page.getByRole('spinbutton', { name: 'End Localization [m]' }).inputValue();
  expect(endLocalization).toBe("99999999");
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeEnabled();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  const localizationErrorText = await page.locator("p").textContent();
  console.log(localizationErrorText);
  expect(localizationErrorText).toBe("Please give localization value within [-10000000.00,10000000.00]");

  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).clear();
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill("1000000");
  const updateendLocalization = await page.getByRole('spinbutton', { name: 'End Localization [m]' }).inputValue();
  expect(updateendLocalization).toBe("1000000");
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeEnabled();
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page.getByRole("alert").first()).toHaveText("Track edited successfully");

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

test('Track explore test @SANITY', async ({})  => {
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
  await expect.soft( page.locator('#add-track-section-drawer-test-id')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Add Track' })).toBeVisible();   
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  // name field required assertion
  await expect(page.getByLabel('Name Input Error Message')).toContainText('Name is required');

  //add track 
  await page.getByRole('textbox', { name: 'NameInput' }).click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill('Track 1');
  await page.getByRole('textbox', { name: 'Number' }).click();
  await page.getByRole('textbox', { name: 'Number' }).fill('123456789');
  await page.getByRole('textbox', { name: 'Comment' }).click();
  await page.getByRole('textbox', { name: 'Comment' }).fill('track comment ');
  
  await page.getByRole('spinbutton', { name: 'Start Localization [m]' }).fill('100');
  await page.getByRole('spinbutton', { name: 'End Localization [m]' }).fill('2000');
  await page.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect( page.locator('#add-track-section-drawer-test-id')).not.toBeVisible();
  await expect(page.getByRole("alert").first()).toHaveText("Track created successfully");
  await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
  await expect(page.getByText('Track', { exact: true })).toBeVisible();

  // track edit 
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 2");
  await page.getByRole('button', { name: 'Custom Submit Button'}).click();
  await expect(page.getByRole("alert").first()).toHaveText("Track edited successfully");
  await expect( page.locator('#add-track-section-drawer-test-id')).not.toBeVisible();

  // Track cancel when no edit data
  await page.reload();
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('button', { name: 'Cancel'}).click();
  await expect( page.locator('#add-track-section-drawer-test-id')).not.toBeVisible();


  // track edit and cancel when edit data :: ok 
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 3");
  await page.getByRole('button', { name: 'Cancel'}).click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // track edit and cancel when edit data :: cancle
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 3");
  await page.getByRole('button', { name: 'Cancel'}).click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  // track edit and cancel when edit data :: cross 
  await page.getByRole('button', { name: 'Cancel'}).click();
  await page.getByRole('button', { name: /Close/i }).click();

  // Track Clear when no edit data
  await page.reload();
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByTestId('ClearIcon').click();
 

  // Track Clear when edit data cross:Confirm
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 4");
  await page.getByTestId('ClearIcon').click();
  await page.getByRole('button', { name: 'Confirm' }).click();

  // Track Clear when edit data cross:Cancel
  await page.getByTestId('EditIcon').isVisible();
  await page.getByTestId('EditIcon').click();
  await page.getByRole('textbox', { name: 'NameInput' }).fill("New Edited track 4");
  await page.getByTestId('ClearIcon').click();
  await page.getByRole('button', { name: 'Cancel' }).click();

  // Track Clear when edit data cross :Cross
  await page.getByTestId('ClearIcon').first().click();
  await page.locator("button[aria-label='Close'] svg").click();
  await page.reload();


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
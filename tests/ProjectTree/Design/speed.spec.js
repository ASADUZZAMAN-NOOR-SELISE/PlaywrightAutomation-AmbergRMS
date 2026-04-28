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




test('Add new Speed', async ({}) => {
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
  await expect(page.getByRole('alert').first()).toContainText('Track created successfully');
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
  await expect(page.getByRole('alert').first()).toContainText('Design created successfully');
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  // speed add
  await design.speedClick();
  await expect(page.getByTestId("custom-side-bar").getByText(/speed/i).first()).toBeVisible();
  await design.clickEditIcon();
  await expect(design.speedDrawer).toBeVisible();
  
  // speed drawer content assertion
  await expect(design.speedDrawer.getByRole('heading')).toContainText('Edit Speed');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Comment');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('START LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('END LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('SPEED [km/h]*');
  await expect(design.speedDrawer.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(design.speedDrawer.getByText('Add Speed')).toBeVisible();
  await expect(design.speedDrawer.getByText('Save changes')).toBeVisible();
  // enter speed value 
  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('100');
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').fill('200');
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').click();
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').fill('100');
  await design.speedDrawer.getByText('Save changes').click();
  // value assertion after save 
  await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');
  await expect(page.getByTestId('custom-side-bar')).toContainText('200.00');
  await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');
  // Edit the speed again and add one more speed range
  await design.clickEditIcon();
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').click();
  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.locator('input[name="Elements.1.StationingEnd"]').fill('300');
  await design.speedDrawer.locator('input[name="Elements.1.Speed"]').click();
  await design.speedDrawer.locator('input[name="Elements.1.Speed"]').fill('500');
  await design.speedDrawer.getByText('Save changes').click();
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Please enter speed between 0 and 360.00 km/h');


});


test('Delete Speed', async ({}) => {
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
  await expect(page.getByRole('alert').first()).toContainText('Track created successfully');
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
  await expect(page.getByRole('alert').first()).toContainText('Design created successfully');
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  // speed add
  await design.speedClick();
  await expect(page.getByTestId("custom-side-bar").getByText(/speed/i).first()).toBeVisible();
  await design.clickEditIcon();
  await expect(design.speedDrawer).toBeVisible();
  
  // speed drawer content assertion
  await expect(design.speedDrawer.getByRole('heading')).toContainText('Edit Speed');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Comment');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('START LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('END LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('SPEED [km/h]*');
  await expect(design.speedDrawer.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(design.speedDrawer.getByText('Add Speed')).toBeVisible();
  await expect(design.speedDrawer.getByText('Save changes')).toBeVisible();
  // enter speed value 
  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('300');
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').fill('200');
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').click();
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').first().fill('120');
  await design.speedDrawer.getByText('Save changes').click();
  await expect(page.getByText('End Localization must be greater than Start Localization', { exact: true })).toBeVisible();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('100');
  await design.speedDrawer.getByText('Save changes').click();
  // value assertion after save 
  await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');
  await expect(page.getByTestId('custom-side-bar')).toContainText('200.00');
  await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');
  // Edit the speed again and add one more speed range
  await design.clickEditIcon();
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').click();
  await design.speedDrawer.getByText('Add Speed').click();
  //assertion secon speed first input box value
  const previouseLaseLocalization = await design.speedDrawer.getByPlaceholder('End Localization [m]*').first().inputValue();
  const newStart = await design.speedDrawer.getByPlaceholder('Start Localization [m]*').nth(1).inputValue();
  expect(newStart).toBe(previouseLaseLocalization);
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').nth(1).fill('300');
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').nth(1).fill('120');

  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.getByPlaceholder('End Localization [m]*').last().fill('350');;
  await design.speedDrawer.getByPlaceholder('Speed [km/h]*').last().fill('130');
  await design.speedDrawer.getByText('Save changes').click();

  //edit and delete 
  await design.speedClick();
  await design.clickEditIcon();
  const deleteCount = await page.getByTestId("DeleteIcon").count();
  console.log(deleteCount);
  await page.getByTestId("DeleteIcon").last().click();
  const newDelete = await page.getByTestId("DeleteIcon").count()
  console.log(newDelete);
  if(newDelete < deleteCount){
    await design.speedDrawer.getByText(/save changes/i).click();
  }
});

// test('Speed > Edit > Cross and cancel when no data ', async ({}) => {
//   const page = await webContext.newPage();
  
//   const loginPage = new LoginPage(page);
//   const common = new Common(page);
//   const design = new DesignPage(page);
//   const tree = new ProjectTreePage(page);
//   const projectName = getUniqueProjectName();
  
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
//   await expect(page.getByRole('alert').first()).toContainText('Track created successfully');
//   await expect(page.getByTestId('line-section-tree-testid-child-0').getByText('Track')).toBeVisible();
//   await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();

//   // add design
//   await expect(page.locator(".project-tree-design")).toBeVisible();

//   await design.clickAddDesign();

//   // validation
//   await design.submitEmptyForm();
//   await design.verifyNameRequired();

//   // fill form
//   await design.fillName("Design 1");
//   await design.openCalendar();
//   await design.goToNextMonth();
//   await design.selectDate(15);
//   await design.fillComment("Design 1 comment");

//   // submit
//   await design.submitDesign();
//   await expect(page.getByRole('alert').first()).toContainText('Design created successfully');
  
//   // verification
//   await design.verifyDesignCreated(
//     "Design 1",
//     "Design 1 comment",
//     "2026.04.15"
//   );
//   // speed add
//   await design.speedClick();
//   await expect(page.getByTestId("custom-side-bar").getByText(/speed/i).first()).toBeVisible();
//   await design.clickEditIcon();
//   await expect(design.speedDrawer).toBeVisible();
  
//   // speed drawer content assertion
//   await expect(design.speedDrawer.getByRole('heading')).toContainText('Edit Speed');
//   await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Comment');
//   await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('START LOCALIZATION [m]*');
//   await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('END LOCALIZATION [m]*');
//   await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('SPEED [km/h]*');
//   await expect(design.speedDrawer.getByRole('button', { name: 'Cancel' })).toBeVisible();
//   await expect(design.speedDrawer.getByText('Add Speed')).toBeVisible();
//   await expect(design.speedDrawer.getByText('Save changes')).toBeVisible();
//   // enter speed value 
//   await design.speedDrawer.getByText('Add Speed').click();
//   await design.speedDrawer.getByPlaceholder('Start Localization [m]*').click();
//   await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('300');
//   await design.speedDrawer.getByPlaceholder('End Localization [m]*').click();
//   await design.speedDrawer.getByPlaceholder('End Localization [m]*').fill('200');
//   await design.speedDrawer.getByPlaceholder('Speed [km/h]*').click();
//   await design.speedDrawer.getByPlaceholder('Speed [km/h]*').first().fill('120');
//   await design.speedDrawer.getByText('Save changes').click();
//   await expect(page.getByText('End Localization must be greater than Start Localization', { exact: true })).toBeVisible();
//   await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('100');
//   await design.speedDrawer.getByText('Save changes').click();
//   // value assertion after save 
//   await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');
//   await expect(page.getByTestId('custom-side-bar')).toContainText('200.00');
//   await expect(page.getByTestId('custom-side-bar')).toContainText('100.00');

//   // Edit the speed again and add one more speed range
//   await design.clickEditIcon();
//   // mdoal cross button click 
//   await design.clickCrossBtn();

//   await design.clickEditIcon();
//   // mdoal cancel button click 
//   await design.clickCancelBtn();

//error after first time add speed > save then edit > click cross or cancle the confirmation modal open 

// });


test('Edit > Cross and cancel When data', async ({}) => {
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
  await expect(page.getByRole('alert').first()).toContainText('Track created successfully');
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
  await expect(page.getByRole('alert').first()).toContainText('Design created successfully');
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  // speed add
  await design.speedClick();
  await expect(page.getByTestId("custom-side-bar").getByText(/speed/i).first()).toBeVisible();
  await design.clickEditIcon();
  await expect(design.speedDrawer).toBeVisible();
  
  // speed drawer content assertion
  await expect(design.speedDrawer.getByRole('heading')).toContainText('Edit Speed');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Comment');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('START LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('END LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('SPEED [km/h]*');
  await expect(design.speedDrawer.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(design.speedDrawer.getByText('Add Speed')).toBeVisible();
  await expect(design.speedDrawer.getByText('Save changes')).toBeVisible();
  // enter speed value 
  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('300');
  
  // cross button > cross, cancel , Confirm 
  await design.clickCrossBtn();
  await design.modalCrossBtn.last().click();
  
  await design.clickCrossBtn();
  await design.modalCancelBtn.last().click();

  await design.clickCrossBtn();
  await expect(page.getByText("Please confirm your action")).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /confirm/i })).toBeEnabled();
  await page.getByRole('button', { name: /confirm/i }).click();

});

test('Edit > Cancel When data', async ({}) => {
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
  await expect(page.getByRole('alert').first()).toContainText('Track created successfully');
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
  await expect(page.getByRole('alert').first()).toContainText('Design created successfully');
  
  // verification
  await design.verifyDesignCreated(
    "Design 1",
    "Design 1 comment",
    //"2026.04.15"
  );
  // speed add
  await design.speedClick();
  await expect(page.getByTestId("custom-side-bar").getByText(/speed/i).first()).toBeVisible();
  await design.clickEditIcon();
  await expect(design.speedDrawer).toBeVisible();
  
  // speed drawer content assertion
  await expect(design.speedDrawer.getByRole('heading')).toContainText('Edit Speed');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('Comment');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('START LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('END LOCALIZATION [m]*');
  await expect(design.speedDrawer.getByLabel('EditSpeedForm')).toContainText('SPEED [km/h]*');
  await expect(design.speedDrawer.getByRole('button', { name: 'Cancel' })).toBeVisible();
  await expect(design.speedDrawer.getByText('Add Speed')).toBeVisible();
  await expect(design.speedDrawer.getByText('Save changes')).toBeVisible();
  // enter speed value 
  await design.speedDrawer.getByText('Add Speed').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').click();
  await design.speedDrawer.getByPlaceholder('Start Localization [m]*').fill('300');

  // cancel button > cross, cancel , Confirm 
  await design.clickCancelBtn();
  await expect(page.getByText("Please confirm your action")).toBeVisible();
  await design.modalCrossBtn.last().click();
  
  await design.clickCancelBtn();
  await expect(page.getByText("Please confirm your action")).toBeVisible();
  await design.modalCancelBtn.last().click();

  await design.clickCancelBtn();
  await expect(page.getByText("Please confirm your action")).toBeVisible();
  await expect(design.modalConfirmBtn.last()).toBeVisible();
  await expect(design.modalConfirmBtn.last()).toBeEnabled();
  //await design.modalConfirmBtn.last().click();
  await page.getByRole('button', { name: /confirm/i }).click();

});
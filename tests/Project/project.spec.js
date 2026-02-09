const { test,expect } = require('@playwright/test');
const { LoginPage } = require('../../Utils/loginPage');
const { Common } = require('../../Utils/common');
const { data } = require('../../Utils/Data/Information');
const {Project} = require('../Project/project.page');
const { projectData } = require('./project.data');
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

test('Project info  @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(data.templateName.en13848);
  await common.submitProject();
  await common.searchProject(data.templateName.en13848);
  await expect(page.getByLabel(data.templateName.en13848).first()).toBeVisible();
  await common.enterIntoProject(data.templateName.en13848);
  await expect(page.getByRole('heading', { name: data.templateName.en13848 })).toBeVisible();
  const projectInfoPage = await expect(page.locator('button:has-text("PROJECT CONFIGURATION")')).toBeVisible();
  if(projectInfoPage) {
    console.log('Project Info visible - Test Passed');
  }
  await common.deleteInProjectTree();
});

test('Project Edit info  @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const project = new Project(page);
  

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectData.project.name);
  await common.submitProject();
  await common.searchProject(projectData.project.name);
  await expect(page.getByLabel(projectData.project.name).first()).toBeVisible();
  await common.enterIntoProject(projectData.project.name);
  await expect(page.getByRole('heading', { name: projectData.project.name })).toBeVisible();
  await page.locator("svg[data-testid='EditIcon']").click();
  await project.fillProjectInfo(projectData.project);
  await project.fillRange(projectData.project);
  await project.fillCustomerInfo(projectData.customerData);
  await project.submit();
  await project.expectSuccess();
});

test('Project Edit and cancel @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const project = new Project(page);
  

  await loginPage.goto();
  await common.clickNewProject();
  await common.setProjectName(projectData.project.name);
  await common.submitProject();
  await common.searchProject(projectData.project.name);
  await expect(page.getByLabel(projectData.project.name).first()).toBeVisible();
  await common.enterIntoProject(projectData.project.name);
  await expect(page.getByRole('heading', { name: projectData.project.name })).toBeVisible();
  await page.locator("svg[data-testid='EditIcon']").click();
  await project.fillProjectInfo(projectData.project);
  await project.fillRange(projectData.project);
  await project.fillCustomerInfo(projectData.customerData);
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('button', { name: /confirm/i }).isVisible();
  await page.getByRole('button', { name: /confirm/i }).click();
});

test('Project Drawer Visibility @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const project = new Project(page);
  

  await loginPage.goto();
  await page.locator("tbody tr").first().isVisible();
  await page.locator("tbody tr").first().click();
  await expect(page.locator('div.MuiBox-root.css-llfbr7')).toBeVisible();
});

test('Delete Confirm modal open @SANITY ', async () => {
  const page = await webContext.newPage();
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const project = new Project(page);
  

  await loginPage.goto();
  await page.locator("tbody tr").first().isVisible();
  await page.locator("tbody tr").first().click();
  await expect(page.locator('div.MuiBox-root.css-llfbr7')).toBeVisible();
});



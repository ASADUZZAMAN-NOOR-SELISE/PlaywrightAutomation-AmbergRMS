const { test, expect } = require('@playwright/test');
import { LoginPage } from '../../../Utils/loginPage';
import { Common } from '../../../Utils/common';
import path from 'path';
import { data } from '../../../Utils/Data/Information';

test('Import Project', async ({page}) => {
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const filePath = "tests/Create Project/Import Project/Project File/project_2026-04-10_031857.rmsproj";

  await loginPage.goto();
  //await page.locator(".MuiGrid-root").nth(1).isVisible();
  await loginPage.verifyInitialState();
  await loginPage.login();
  await loginPage.logoutVisible();
  await page.getByRole("button", { name: "Import"}).click();

  //filechhosser upload project
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("div img").last().click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.resolve(filePath));

  const projectUploadText = page.getByText('The project is a new project', { exact: true });
  await expect(projectUploadText).toBeVisible();

  const importProjectBtn =  page.getByRole('button', { name: 'Custom Submit Button' });
  await expect(importProjectBtn).toBeVisible();
  await importProjectBtn.click();

  const projectUploadSuccessTost = "Importing of the project project in progress. We will notify you when data is ready to be used.";
  await expect(page.getByRole("alert")).toHaveText(projectUploadSuccessTost);

  const projectName = "project";
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();

});

test('Import Project > Existence validation check', async ({page}) => {
  const loginPage = new LoginPage(page);
  const common = new Common(page);
  const filePath = "tests/Create Project/Import Project/Project File/project_2026-04-10_031857.rmsproj";

  await loginPage.goto();
  //await page.locator(".MuiGrid-root").nth(1).isVisible();
  await loginPage.verifyInitialState();
  await loginPage.login();
  await loginPage.logoutVisible();
  await page.getByRole("button", { name: "Import"}).click();

  //filechhosser upload project
  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.locator("div img").last().click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(path.resolve(filePath));
  
  //existing file validation 
  const projectUploadText = page.getByText('project project already exists');
  await expect(projectUploadText).toBeVisible();

  const importProjectBtn =  page.getByRole('button', { name: 'Custom Submit Button' });
  await expect(importProjectBtn).toBeVisible();
  await importProjectBtn.click();

  const projectUploadSuccessTost = "Importing of the project project in progress. We will notify you when data is ready to be used.";
  await expect(page.getByRole("alert")).toHaveText(projectUploadSuccessTost);

  const projectName = "project";
  await common.searchProject(projectName);
  await expect(page.getByLabel(projectName).first()).toBeVisible();
});

// import { test, expect } from '@playwright/test';
// import { ChartPage } from './chart.page';

// test.only('test', async ({ browser }) => {
//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const chartPage = new ChartPage(page);
  
//   await page.goto('https://dev-amberg.seliselocal.com/login?go=/projects');
//   await page.getByRole('button', { name: 'Login submit button' }).click();
  
//   // Use searchProject and enterIntoProject from ChartPage
//   await chartPage.searchProject('Auto Inspection');
//   await chartPage.enterIntoProject('Auto Inspection');
  
//   await page.getByTestId('line-section-tree-testid').getByText('line').click();
//   await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
//   await page.getByTestId('job-tree-testid').getByText('job').click();
//   const page1Promise = page.waitForEvent('popup');
//   await page.getByTestId('job-tree-testid-child-0').getByRole('button').filter({ hasText: /^$/ }).click();
//   const page1 = await page1Promise;
//   await expect(page1.getByRole('heading')).toContainText('2024-02-23 18:00:02');
//   await page1.getByText("Events").click();
//   await page1.getByTestId("AddIcon").click();
//   await expect(page1.getByRole('heading')).toContainText('Add Event');
//   await page.getByRole('combobox', { name: 'Event Name Select' }).click();
//   await page.getByRole('listbox').getByRole('option').filter({ hasText: 'Change of Speed'}).click();
//   await page.getByRole('textbox', { name: 'Comment' }).fill('This is a comment for Change of Speed event.');
//   await page.getByRole('button', { name: 'Submit' }).click();
//   await expect(page1.getByText('This is a comment for Change of Speed event.')).toBeVisible();

  
// });
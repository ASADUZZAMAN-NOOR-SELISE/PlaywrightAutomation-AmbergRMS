import { test, expect } from '@playwright/test';
import { ChartPage } from './chart.page';

test('test', async ({ page }) => {
  const chartPage = new ChartPage(page);
  
  await page.goto('https://dev-amberg.seliselocal.com/login?go=/projects');
  await page.getByRole('button', { name: 'Login submit button' }).click();
  
  // Use searchProject and enterIntoProject from ChartPage
  await chartPage.searchProject('Auto Inspection');
  await chartPage.enterIntoProject('Auto Inspection');
  
  await page.getByTestId('line-section-tree-testid').getByText('line').click();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
  await page.getByTestId('job-tree-testid').getByText('job').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByTestId('job-tree-testid-child-0').getByRole('button').filter({ hasText: /^$/ }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('heading')).toContainText('2024-02-23 18:00:02');
  await page1.getByRole('button', { name: 'filter-button' }).click();
  await expect(page1.getByTestId('chart-filter-section-drawer-test-id').getByRole('heading')).toContainText('Filter for Chart');
  await page1.getByLabel('select-all-parameters').getByRole('checkbox').check();
  await page1.getByLabel('select-all-parameters').getByRole('checkbox').uncheck();
  await expect(page1.getByRole('button', { name: 'Custom Submit Button' })).toBeVisible();
  await page1.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page1.getByLabel('chart-error-text')).toContainText('No chart data found');
  await page1.getByRole('button', { name: 'filter-button' }).click();
  await page1.getByRole('checkbox').nth(1).check();
  await page1.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page1.getByTestId('canvasjs-container')).toContainText('Gauge Defect - Nominal Gauge to Peak [mm]');
  await page1.getByRole('button', { name: 'filter-button' }).click();
  await page1.getByRole('checkbox').nth(1).uncheck();
  await page1.getByRole('checkbox').nth(2).check();
  await page1.getByRole('button', { name: 'Custom Submit Button' }).click();
  await expect(page1.getByTestId('canvasjs-container')).toContainText('Gauge Defect - Mean to Peak [mm]');
});

test('chart zoom page', async ({ page }) => {
  const chartPage = new ChartPage(page);
  
  await page.goto('https://dev-amberg.seliselocal.com/login?go=/projects');
  await page.getByRole('button', { name: 'Login submit button' }).click();
  
  // Use searchProject and enterIntoProject from ChartPage
  await chartPage.searchProject('Auto Inspection');
  await chartPage.enterIntoProject('Auto Inspection');
  
  await page.getByTestId('line-section-tree-testid').getByText('line').click();
  await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
  await page.getByTestId('job-tree-testid').getByText('job').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByTestId('job-tree-testid-child-0').getByRole('button').filter({ hasText: /^$/ }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('heading')).toContainText('2024-02-23 18:00:02');
  await page1.getByRole('button', { name: 'full-screen-button' }).click();
  await expect(page1.locator('div').filter({ hasText: 'Charts20000.06Sample' }).nth(2)).toBeVisible();
  await expect(page1.getByText('Charts').nth(1)).toBeVisible();
  await expect(page1.getByRole('button', { name: 'new-tab-button' })).toBeVisible();
  await expect(page1.getByRole('button', { name: 'full-screen-button' })).toBeVisible();
  await expect(page1.getByRole('button', { name: 'next-button' })).toBeVisible();
  await expect(page1.getByRole('button', { name: 'prev-button' })).toBeVisible();
  await expect(page1.getByRole('button', { name: 'reload-button' })).toBeVisible();
});

// test('chart new page', async ({ browser }) => {


//   const context = await browser.newContext();
//   const page = await context.newPage();
//   const chartPage = new ChartPage(page);

//   await page.goto('https://dev-amberg.seliselocal.com/login?go=/projects');
//   await page.getByRole('button', { name: 'Login submit button' }).click();

//   await chartPage.searchProject('Auto Inspection');
//   await chartPage.enterIntoProject('Auto Inspection');

//   await page.getByTestId('line-section-tree-testid').getByText('line').click();
//   await page.getByTestId('line-section-tree-testid-child-0').getByText('Track').click();
//   await page.getByTestId('job-tree-testid').getByText('job').click();

//   const [measurementPage] = await Promise.all([
//     page.context().waitForEvent('page'),
//     page
//       .getByTestId('job-tree-testid-child-0')
//       .getByRole('button')
//       .filter({ hasText: /^$/ })
//       .click(),
//   ]);

//   await measurementPage.waitForLoadState('domcontentloaded');

//   await expect(measurementPage.getByRole('heading')).toContainText(
//     '2024-02-23 18:00:02'
//   );

//   const [chartNewPage] = await Promise.all([
//     measurementPage.context().waitForEvent('page'),
//     measurementPage.getByRole('button', { name: 'new-tab-button' }).click(),
//   ]);
  
//   await chartNewPage.reload();
//   await chartNewPage.waitForLoadState('domcontentloaded');
//   await chartNewPage.waitForURL(/\/chart\?id=/);

//   await expect(chartNewPage.getByRole('button', { name: 'next-button' })).toBeVisible();
//   await chartNewPage.getByRole('button', { name: 'next-button' }).click();

//   await expect(chartNewPage.getByRole('button', { name: 'prev-button' })).toBeVisible();
//   await chartNewPage.getByRole('button', { name: 'prev-button' }).click();

//   await expect(chartNewPage.getByRole('button', { name: 'reload-button' })).toBeVisible();

//   await expect(chartNewPage.getByLabel('chart', { exact: true })).toContainText('Charts');

//   await chartNewPage.close();
//   await measurementPage.close();
// });


import { test, expect } from '@playwright/test';

test('test @SUPPORT', async ({ page }) => {
  await page.goto('https://dev-amberg.seliselocal.com/login?go=/');
  await page.getByRole('button', { name: 'Login submit button' }).click();
  await page.getByRole('button', { name: 'Support' }).click();
  await expect(page.getByRole('menuitem', { name: 'About' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Contact Us' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'SSL Certificate' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'About' }).click();
  await expect(page.getByText('About Amberg Track Pro Office')).toBeVisible();
  await expect(page.locator('#customized-dialog-title')).toContainText('About Amberg Track Pro Office');
  await expect(page.getByRole('img', { name: 'amberg logo' })).toBeVisible();
  await expect(page.getByLabel('About Amberg Track Pro Office')).toContainText('Version1.7');
  await expect(page.getByLabel('About Amberg Track Pro Office')).toContainText('Build Number20260129.1893');
  await expect(page.getByLabel('About Amberg Track Pro Office')).toContainText('Release Date2026.01.29');
  await expect(page.getByLabel('PlusExpiryFeature', { exact: true })).toContainText('ATP Office Plus Expiration Date');
  await expect(page.getByLabel('PlusExpiryFeatureProRailVersion')).toContainText('ProRail Database Version2025.10.16');
  await expect(page.getByLabel('About Amberg Track Pro Office')).toContainText('* Use the License Tool for managing the software licenses');
  await expect(page.getByLabel('About Amberg Track Pro Office')).toContainText('© 2026 Amberg Technologies AG');
  await expect(page.getByRole('link', { name: 'Privacy policy' })).toBeVisible();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Privacy policy' }).click();
  const page1 = await page1Promise;
  await expect(page1.getByRole('strong')).toContainText('Privacy settings');
  await expect(page.getByRole('button', { name: 'confirm' })).toBeVisible();
  await page.getByRole('button', { name: 'confirm' }).click();
});
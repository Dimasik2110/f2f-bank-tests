import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `balance_${Date.now()}@example.com`;
}

test('Пополнение баланса', async ({ page }) => {
  const email = uniqueEmail();
  const password = 'TestPassword123!';

  await page.goto('/register');

  await page.getByPlaceholder('Type your name').fill('Balance');
  await page.getByPlaceholder('Type your surname').fill('Tester');
  await page.getByPlaceholder('Type your email').fill(email);
  await page.locator('input[type="password"]').fill(password);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.getByPlaceholder('Type your email').fill(email);
  await page.getByPlaceholder('Type your password').fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');

  await page.getByRole('link', { name: 'Transactions' }).click();

  await expect(
    page.getByRole('heading', { name: 'Transactions' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Add balance' }).click();

  await expect(
    page.getByRole('heading', { name: 'Add balance' })
  ).toBeVisible();

  await page.getByPlaceholder('Enter sum').fill('100');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: /Balance:\s*100/ })
  ).toBeVisible();
});
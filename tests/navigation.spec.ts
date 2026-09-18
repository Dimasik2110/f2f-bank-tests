import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `navigation_${Date.now()}@example.com`;
}

async function registerAndLogin(page: import('@playwright/test').Page) {
  const email = uniqueEmail();
  const password = 'TestPassword123!';

  await page.goto('/register');

  await page.getByPlaceholder('Type your name').fill('Test');
  await page.getByPlaceholder('Type your surname').fill('User');
  await page.getByPlaceholder('Type your email').fill(email);
  await page.locator('input[type="password"]').fill(password);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.getByPlaceholder('Type your email').fill(email);
  await page.getByPlaceholder('Type your password').fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
}

test.describe('Навигация авторизованного пользователя', () => {
  test('Пользователь может открыть профиль', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('link', { name: 'Profile' }).click();

    await expect(page).toHaveURL(/\/profile/);
  });

  test('Пользователь может открыть историю транзакций', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('link', { name: 'Transactions' }).click();

    await expect(page).toHaveURL(/\/transactions/);
    await expect(page.getByRole('heading', { name: 'Transactions' })).toBeVisible();
  });

  test('Пользователь может вернуться на главную страницу', async ({ page }) => {
    await registerAndLogin(page);

    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/profile/);

    await page.getByRole('link', { name: 'Main' }).click();

    await expect(page).toHaveURL('/');
    await expect(
      page.getByText('Transfer by phone number')
    ).toBeVisible();
  });
});
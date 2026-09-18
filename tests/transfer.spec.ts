import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `transfer_${Date.now()}@example.com`;
}

async function registerAndLogin(page: import('@playwright/test').Page) {
  const email = uniqueEmail();
  const password = 'TestPassword123!';

  await page.goto('/register');

  await page.getByPlaceholder('Type your name').fill('Transfer');
  await page.getByPlaceholder('Type your surname').fill('Tester');
  await page.getByPlaceholder('Type your email').fill(email);
  await page.locator('input[type="password"]').fill(password);

  await page.getByRole('button', { name: 'Register' }).click();

  await expect(page).toHaveURL(/\/login/);

  await page.getByPlaceholder('Type your email').fill(email);
  await page.getByPlaceholder('Type your password').fill(password);

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL('/');
}

test.describe('Переводы', () => {
  test.beforeEach(async ({ page }) => {
    await registerAndLogin(page);
  });

  test('Главная страница содержит форму перевода', async ({ page }) => {
    await expect(
      page.getByText('Transfer by phone number')
    ).toBeVisible();

    await expect(
      page.getByPlaceholder('+7 999 123-45-67')
    ).toBeVisible();

    await expect(
      page.getByPlaceholder('0.00')
    ).toBeVisible();

    await expect(
      page.getByPlaceholder('e.g. debt repayment')
    ).toBeVisible();

    await expect(
      page.getByRole('button', { name: 'Send' })
    ).toBeVisible();
  });

  test('Телефон должен начинаться с +', async ({ page }) => {
    const phone = page.getByPlaceholder('+7 999 123-45-67');

    await phone.fill('79991234567');
    await phone.blur();

    await expect(
      page.getByText(/Must start with \+/)
    ).toBeVisible();
  });

  test('Телефон должен содержать от 10 до 15 цифр', async ({ page }) => {
    const phone = page.getByPlaceholder('+7 999 123-45-67');

    await phone.fill('+123');
    await phone.blur();

    await expect(
      page.getByText(/Phone must contain 10–15 digits/)
    ).toBeVisible();
  });

  test('Нельзя выполнить перевод с отрицательной суммой', async ({ page }) => {
    await page.getByPlaceholder('+7 999 123-45-67').fill('+79991234567');
    await page.getByPlaceholder('0.00').fill('-100');
    await page.getByPlaceholder('e.g. debt repayment').fill('Test transfer');

    await page.getByRole('button', { name: 'Send' }).click();

    await expect(
      page.getByText('Amount must be greater than zero')
    ).toBeVisible();
  });

  test('Нельзя выполнить перевод без заполнения обязательных полей', async ({ page }) => {
    await page.getByPlaceholder('+7 999 123-45-67').fill('+79991234567');

    await page.getByRole('button', { name: 'Send' }).click();

    expect(
  await page.locator('input[name="amount"]').evaluate(
    (el: HTMLInputElement) => el.checkValidity()
  )
).toBe(false);

expect(
  await page.locator('input[name="purpose"]').evaluate(
    (el: HTMLInputElement) => el.checkValidity()
  )
).toBe(false);
  });
});
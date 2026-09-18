import { test, expect } from '@playwright/test';

function uniqueEmail() {
  return `test_${Date.now()}@example.com`;
}

test.describe('Авторизация и регистрация', () => {
  test('Регистрация нового пользователя', async ({ page }) => {
    const email = uniqueEmail();

    await page.goto('/register');

    await page.getByPlaceholder('Type your name').fill('Test');
    await page.getByPlaceholder('Type your surname').fill('User');
    await page.getByPlaceholder('Type your email').fill(email);
    await page.locator('input[type="password"]').fill('TestPassword123!');

    await page.getByRole('button', { name: 'Register' }).click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByText('Login to F2F Bank')).toBeVisible();
  });

  test('Регистрация без заполнения обязательных полей', async ({ page }) => {
    await page.goto('/register');

    await page.getByRole('button', { name: 'Register' }).click();

    expect(
  await page.locator('input[name="name"]').evaluate(
    (el: HTMLInputElement) => el.checkValidity()
  )
).toBe(false);

expect(
  await page.locator('input[name="surname"]').evaluate(
    (el: HTMLInputElement) => el.checkValidity()
  )
).toBe(false);

expect(
  await page.locator('input[name="login"]').evaluate(
    (el: HTMLInputElement) => el.checkValidity()
  )
).toBe(false);
  });

  test('Переход со страницы входа на страницу регистрации', async ({ page }) => {
    await page.goto('/login');

    await page.getByRole('link', { name: 'Register page' }).click();

    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByText('Register to F2F Bank')).toBeVisible();
  });

  test('Ошибка входа с некорректными данными', async ({ page }) => {
    await page.goto('/login');

    await page.getByPlaceholder('Type your email').fill('wrong@example.com');
    await page.getByPlaceholder('Type your password').fill('WrongPassword123!');

    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Login failed')).toBeVisible();
  });
});
import { test, expect } from '@playwright/test';
import { login } from '../utils/helper';

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/link-sharing');
});

test.describe('Submit link', () => {
  test.only('should appear and filter application table correctly', async ({
    page,
  }) => {
    // Check if the link input and button are visible
    const linkInput = page.getByPlaceholder('URL');
    console.log(await linkInput.innerText());
    expect(linkInput).toBeVisible();

    const button = page.getByRole('button', { name: 'Submit Link' });
    expect(button).toBeVisible();

    // check if the link input is empty
    await button.click();
    const errorText = page.getByText('Invalid url', { exact: true });
    expect(errorText).toBeVisible();
  });
});

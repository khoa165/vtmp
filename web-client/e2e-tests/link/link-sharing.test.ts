import { test, expect } from '@playwright/test';
import { login } from '../utils/helper';

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/link-sharing');
});

test.describe('Submit link', () => {
  test('link sharing page appears and allows to perform action', async ({
    page,
  }) => {
    const randomValue = Math.random();
    // Check if the link input are visible
    const linkInput = page.locator('#url');
    await linkInput.waitFor({ state: 'visible' });
    expect(linkInput).toBeVisible();
    // check if the button are visible
    const button = page.getByRole('button', { name: 'Submit Link' });
    await button.waitFor({ state: 'visible' });
    await expect(button).toBeVisible();
    // Fill input
    await linkInput.fill(`https://www.test/vtmp/${randomValue}`);
    await button.click();
    // Verify that the input's text is cleared or removed
    await expect(linkInput).toHaveValue('');
  });
});

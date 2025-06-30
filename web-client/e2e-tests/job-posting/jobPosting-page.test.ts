import { test, expect } from '@playwright/test';
import { login } from '../utils/helper';

test.beforeEach(async ({ page }) => {
  await login(page);
});

test.describe('Job Posting Card', () => {
  test('should display job posting cards', async ({ page }) => {
    // Check cards are visible or not
    const firstCard = page.getByTestId(`status-card-jobposting-1`);
    await firstCard.waitFor({ state: 'visible' });
    await expect(firstCard).toBeVisible();

    const secondCard = page.getByTestId(`status-card-jobposting-2`);
    await secondCard.waitFor({ state: 'visible' });
    await expect(secondCard).toBeVisible();
    // Click the button or link labeled "Share a Job Link"
    const button = secondCard.locator('span', { hasText: 'Share a Job Link' });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page).toHaveURL(/\/link-sharing$/);
  });
});

test.describe('Job posting Table', () => {
  test('should display all key job posting columns', async ({ page }) => {
    const headersLocator = page.locator(
      'th[role=columnheader][data-testid^="job-header-"]'
    );

    await headersLocator.first().waitFor({ state: 'visible' });

    let headersCount = 0;
    const total = await headersLocator.count();

    for (let i = 0; i < total; i++) {
      if (await headersLocator.nth(i).isVisible()) {
        headersCount++;
      }
    }

    expect(headersCount).toEqual(7);
  });

  test('should filter jobs by company name', async ({ page }) => {
    const input = page.getByPlaceholder('Filter companies...');
    await input.fill('Goog');
    await page.waitForTimeout(300);

    const rows = page.getByTestId('job-table-row');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const companyCell = rows
        .nth(i)
        .locator('[data-testid="job-cell-companyName"]');
      await expect(companyCell).toContainText(/Google/i);
    }
  });

  test('should sort job posting by date posted', async ({ page }) => {
    const dateHeader = page.getByRole('columnheader', { name: 'Date Posted' });
    const sortButton = dateHeader.locator('button');
    await sortButton.click();

    const rows = page.getByTestId('job-table-row');
    const dates = await rows.evaluateAll((trs) =>
      trs.map((tr) => {
        const dateCell = tr.querySelector('td:nth-child(4)');
        return dateCell ? new Date(dateCell.textContent || '') : null;
      })
    );

    const validDates = dates.filter(
      (d): d is Date => d !== null && d !== undefined
    );

    for (let i = 1; i < validDates.length; i++) {
      expect(validDates[i] >= validDates[i - 1]).toBeTruthy();
    }
  });

  test('should toggle column visibility via configuration dropdown', async ({
    page,
  }) => {
    // Count Header Columns Before Toggling
    const headersLocator = page.locator(
      'th[role=columnheader][data-testid^="job-header-"]'
    );

    await headersLocator.first().waitFor({ state: 'visible' });

    let headersCount = 0;
    const total = await headersLocator.count();

    for (let i = 0; i < total; i++) {
      if (await headersLocator.nth(i).isVisible()) {
        headersCount++;
      }
    }

    // Toggle the "adminNotes" column visibility
    const configButton = page.locator('[data-testid="column-config-button"]');
    await configButton.waitFor({ state: 'visible' });
    await configButton.click();

    // Locate the "adminNotes" checkbox in the dropdown menu
    // Toggle the "adminNotes" column visibility
    const adminNotesCheckbox = page.locator(
      '[data-testid="row-config-adminNotes"]'
    );
    await adminNotesCheckbox.waitFor({ state: 'visible' });
    await expect(adminNotesCheckbox).toBeVisible();
    await adminNotesCheckbox.click();

    // Count Header Columns After Toggling
    let headersAfter = 0;
    const headersAfterLocator = page.locator(
      'th[role=columnheader][data-testid^="job-header-"]'
    );

    await headersAfterLocator.first().waitFor({ state: 'visible' });

    for (let i = 0; i < total; i++) {
      if (await headersAfterLocator.nth(i).isVisible()) {
        headersAfter++;
      }
    }

    // Verify Header Count Decreased
    expect(headersAfter).toBe(headersCount - 1);

    // Verify the "adminNotes" column is hidden
    const firstRow = page.getByTestId('job-table-row').first();
    const adminNotesCell = firstRow.locator(
      '[data-testid="job-cell-adminNotes"]'
    );
    await expect(adminNotesCell).toHaveCount(0);

    // Re-toggle configuration dropdown
    const dropdownContent = page.locator(
      '[data-testid^="dropdown-menu-content"]'
    );

    if (await dropdownContent.first().isVisible()) {
      await configButton.click();
      await dropdownContent.first().waitFor({ state: 'detached' });
    }
    await configButton.click();
    await dropdownContent.first().waitFor({ state: 'visible' });

    // Toggle the "adminNotes" column visibility again
    await adminNotesCheckbox.waitFor({ state: 'visible' });
    await expect(adminNotesCheckbox).toBeVisible();
    await adminNotesCheckbox.click();

    // Verify the "adminNotes" column is visible again
    await firstRow.locator('[data-testid="job-cell-adminNotes"]').waitFor({
      state: 'visible',
    });
    await expect(
      firstRow.locator('[data-testid="job-cell-adminNotes"]')
    ).toBeVisible();
  });
});

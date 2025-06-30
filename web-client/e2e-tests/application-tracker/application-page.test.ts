import { test, expect } from '@playwright/test';
import { login } from '../utils/helper';

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/application-tracker');
});

test.describe('Application Status Card', () => {
  test('should appear and filter application table correctly', async ({
    page,
  }) => {
    const targetStatus = 'INTERVIEWING';
    // Adjust this to the status you want to test 'Interviewing'
    const card = page.getByTestId(`status-card-${targetStatus}`);
    await expect(card).toBeVisible();
    await card.click();

    // Check if the application table is filtered by the target status
    const applicationRows = page.getByTestId('application-table-row');
    await expect(applicationRows.first()).toBeVisible();

    const rows = page.getByTestId('application-table-row');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const statusCell = await rows.nth(i).locator('td').nth(2).innerText();
      expect(statusCell).toContain(targetStatus);
    }

    await card.click();
    await page.waitForTimeout(500);

    const updatedCount = await rows.count();
    expect(updatedCount).toBeGreaterThanOrEqual(count);
  });
});

test.describe('Application Table', () => {
  test('should display all key application columns', async ({ page }) => {
    const expectedHeaders = [
      { id: 'companyName', name: 'Company' },
      { id: 'status', name: 'Status' },
      { id: 'appliedOnDate', name: 'Date Applied' },
      { id: 'portalLink', name: 'Portal Link' },
      { id: 'interest', name: 'Interest' },
      { id: 'referrer', name: 'Referrer' },
      { id: 'note', name: 'Note' },
    ];

    for (const { id, name } of expectedHeaders) {
      const text = await page
        .locator(`[data-testid="application-header-${id}"]`)
        .innerText();
      expect(text.trim()).toBe(name);
    }
  });

  test('should filter applications by company name', async ({ page }) => {
    const input = page.getByPlaceholder('Filter companies...');
    await input.fill('Go');
    await page.waitForTimeout(300);

    const rows = page.getByTestId('application-table-row');
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      const companyCell = rows
        .nth(i)
        .locator('[data-testid="application-cell-companyName"]');
      await expect(companyCell).toContainText(/Goldman/i);
    }
  });

  test('should sort applications by date applied', async ({ page }) => {
    const dateHeader = page.getByRole('columnheader', { name: 'Date Applied' });
    const sortButton = dateHeader.locator('button');
    await sortButton.click();

    const rows = page.getByTestId('application-table-row');
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

  test('should update status via dropdown in status column', async ({
    page,
  }) => {
    await page.goto('/application-tracker');

    const firstRow = page.getByTestId('application-table-row').first();
    await firstRow
      .getByTestId('application-cell-status')
      .locator('button')
      .first()
      .click();

    const offeredMenuItem = page.getByRole('menuitem', { name: 'Offered' });
    await expect(offeredMenuItem).toBeVisible();
    await offeredMenuItem.click();

    await expect(firstRow.getByTestId('application-cell-status')).toContainText(
      /offered/i
    );
  });

  test('should toggle column visibility via configuration dropdown', async ({
    page,
  }) => {
    // Count Header Columns Before Toggling
    const headersLocator = page.locator(
      'th[role=columnheader][data-testid^="application-header-"]'
    );

    await headersLocator.first().waitFor({ state: 'visible' });

    let headersCount = 0;
    const total = await headersLocator.count();

    for (let i = 0; i < total; i++) {
      if (await headersLocator.nth(i).isVisible()) {
        headersCount++;
      }
    }

    // Toggle the "Note" column visibility
    const configButton = page.locator('[data-testid="column-config-button"]');
    await configButton.waitFor({ state: 'visible' });
    await configButton.click();

    // Locate the "Note" checkbox in the dropdown menu
    // Toggle the "Note" column visibility
    const noteCheckbox = page.locator('[data-testid="row-config-note"]');
    await noteCheckbox.waitFor({ state: 'visible' });
    await expect(noteCheckbox).toBeVisible();
    await noteCheckbox.click();

    // Count Header Columns After Toggling
    let headersAfter = 0;
    const headersAfterLocator = page.locator(
      'th[role=columnheader][data-testid^="application-header-"]'
    );

    await headersAfterLocator.first().waitFor({ state: 'visible' });

    for (let i = 0; i < total; i++) {
      if (await headersAfterLocator.nth(i).isVisible()) {
        headersAfter++;
      }
    }

    // Verify Header Count Decreased
    expect(headersAfter).toBe(headersCount - 1);

    // Verify the "Note" column is hidden
    const firstRow = page.getByTestId('application-table-row').first();
    const noteCell = firstRow.locator('[data-testid="application-cell-note"]');
    await expect(noteCell).toHaveCount(0);

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

    // Toggle the "Note" column visibility again
    await noteCheckbox.waitFor({ state: 'visible' });
    await expect(noteCheckbox).toBeVisible();
    await noteCheckbox.click();

    // Verify the "Note" column is visible again
    await firstRow.locator('[data-testid="application-cell-note"]').waitFor({
      state: 'visible',
    });
    await expect(
      firstRow.locator('[data-testid="application-cell-note"]')
    ).toBeVisible();
  });
});

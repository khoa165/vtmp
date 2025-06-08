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

    const card = page.getByTestId(`status-card-${targetStatus}`);
    await expect(card).toBeVisible();
    await card.click();

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
    const headers = [
      'Company',
      'Status',
      'Date Applied',
      'Portal Link',
      'Interest',
      'Referrer',
      'Note',
    ];

    for (const header of headers) {
      await expect(
        page.getByRole('columnheader', { name: header })
      ).toBeVisible();
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
      console.log(companyCell.innerText);
      await expect(companyCell).toContainText(/Godaddy/i);
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
  test.only('should toggle column visibility via configuration dropdown', async ({
    page,
  }) => {
    const headers = [
      'Company',
      'Status',
      'Date Applied',
      'Portal Link',
      'Interest',
      'Referrer',
      'Note',
    ];

    let headersBefore = 0;

    for (const header of headers) {
      headersBefore += await page
        .getByRole('columnheader', {
          name: header,
        })
        .count();
    }

    console.log('Headers before:', headersBefore);

    const configButton = page.locator('[data-testid="column-config-button"]');
    await configButton.click();

    const noteCheckbox = page.locator('[data-testid="row-config-note"]');
    await expect(noteCheckbox).toBeVisible();
    await noteCheckbox.click();

    const headersAfter = await page.getByRole('columnheader').all();
    const headerCountAfter = headersAfter.length;
    expect(headerCountAfter).toBe(headersBefore - 1);

    const firstRow = page.getByTestId('application-table-row').first();
    const noteCell = firstRow.locator('[data-testid="application-cell-note"]');
    await expect(noteCell).toHaveCount(0);

    await configButton.click();
    console.log('Config button clicked');
    await noteCheckbox.click();
    console.log('Note checkbox clicked');

    await expect(
      firstRow.locator('[data-testid="application-cell-note"]')
    ).toBeVisible();
  });
});

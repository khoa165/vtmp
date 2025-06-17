import { Page } from '@playwright/test';

export async function login(page: Page) {
  await page.goto('/login');

  await page.getByLabel('Email').fill('phuc.jun@vtmp.com');
  await page.getByLabel('Password').fill('password');

  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('**/job-postings');
}

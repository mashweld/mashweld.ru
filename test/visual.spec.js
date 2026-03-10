const { test, expect } = require('@playwright/test');

const pages = [
  { name: 'index',        path: '/' },
  { name: 'partners',     path: '/partners/' },
  { name: 'contacts',     path: '/contacts/' },
  { name: 'certificates', path: '/certificates/' },
];

for (const { name, path } of pages) {
  test(`${name} page`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true });
  });
}

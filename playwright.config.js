module.exports = {
  testDir: './tests',
  snapshotDir: './tests/screenshots',
  use: {
    baseURL: 'http://127.0.0.1:3500',
  },
  webServer: {
    command: 'npx serve www --listen tcp://0.0.0.0:3500 --no-clipboard',
    port: 3500,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'desktop',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'tablet',
      use: { browserName: 'chromium', viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'mobile',
      use: { browserName: 'chromium', viewport: { width: 375, height: 667 } },
    },
  ],
};

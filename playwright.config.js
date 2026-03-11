module.exports = {
  testDir: './test',
  snapshotDir: './test/screenshots',
  use: {
    baseURL: 'http://127.0.0.1:3500',
  },
  webServer: {
    command: 'serve www --listen 3500 --no-clipboard',
				port: 3500,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
  ],
};

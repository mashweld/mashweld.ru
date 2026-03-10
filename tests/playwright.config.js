const path = require('path');

module.exports = {
  testDir: '.',
  snapshotDir: './screenshots',
  use: {
    baseURL: 'http://localhost:3500',
  },
  webServer: {
    command: 'npx serve ../www --listen 3500 --no-clipboard',
    url: 'http://localhost:3500',
    reuseExistingServer: false,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium', viewport: { width: 1280, height: 900 } },
    },
  ],
};


const { devices } = require('@playwright/test');

module.exports = {
  use: {
    headless: false, // Run tests with the browser GUI
    baseURL: 'http://localhost:3000', // Replace with your app's URL
    trace: 'on', // Record trace for each test
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
};

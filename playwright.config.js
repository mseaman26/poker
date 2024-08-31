
const { devices, defineConfig} = require('@playwright/test');
require('dotenv').config({ path: '.env.local' }); 


export default defineConfig({
  use: {
    
    headless: false, // Run tests with the browser GUI
    baseURL: process.env.PLAYWRIGHT_BASE_URL, // Replace with your app's URL
    trace: 'on', // Record trace for each test
    //include all state.json files in the tests/e2e/auth/state directory

  },
  // retries: 2,
  workers: 1,
  projects: [
    //mather for authSetup.test.js
    { name: 'setup', testMatch: /.*\.authSetup\.test\.js/ },
    
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
        storageState: ['tests/e2e/auth/state/user1.json']

      },
      dependancies: ['setup'],
      testMatch: [
        // '**.test.js',
        //'firstTest.test.js',
        // '8players.test.js',
        //'fullGameSetup.test.js',
        // 'authState.test.js',
        //'authSetup.test.js' //logs in and saves state for all users (testuser1-testuser16)
        'resumeGame.test.js' //only works locally, you might have to change the base url in the env file and you may need to re run authSetup if it was run remotely previously
      ],
      
    },
    
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})

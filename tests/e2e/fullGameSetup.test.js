const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

test.describe('Full Game Setup', () => {
    let contextUser1;
    let contextUser2;
    test.setTimeout(60000); //1 min
    test.use({ actionTimeout: 12000 })
    test.beforeAll(async () => {
        // Load user1 state
        contextUser1 = await chromium.launchPersistentContext();
    
        // Load user2 state
        contextUser2 = await chromium.launchPersistentContext('', {
          storageState: 'auth/state/stateUser2.json', // Path to the saved state file
        });
      });
    
    test.afterAll(async () => {
        await contextUser1.close();
        await contextUser2.close();
    });
    test('should have a full game setup', async ({ browser }) => {
        const pageUser1 = await contextUser1.newPage();
        const pageUser2 = await contextUser2.newPage();
    
        await pageUser1.goto('http://localhost:3000');
        await pageUser2.goto('http://localhost:3000');
    
        // User1 joins the game
    })

});
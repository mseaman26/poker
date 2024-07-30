const { test, expect } = require('@playwright/test');

test.describe('tests persistent auth state', () => {
    test.setTimeout(360000); //6 min
    test.use({ actionTimeout: 12000 }); //12 sec action timeout
    test('', async ({ browser }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const context1 = await browser.newContext({storageState: 'tests/e2e/auth/state/user1.json'});
        const context2 = await browser.newContext({storageState: 'tests/e2e/auth/state/user2.json'});
        const context3 = await browser.newContext({storageState: 'tests/e2e/auth/state/user3.json'});
        const context4 = await browser.newContext({storageState: 'tests/e2e/auth/state/user4.json'});
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();
        const page3 = await context3.newPage();
        const page4 = await context4.newPage();

        page1.on('dialog', async dialog => {
            await dialog.accept();
        });
        page2.on('dialog', async dialog => {
            await dialog.accept();
        });
        page3.on('dialog', async dialog => {
            await dialog.accept();
        });
        page4.on('dialog', async dialog => {
            await dialog.accept();
        });

        // const credentials1 = { email: 'player1@player1.com', password: '!Q2w3e4r' };
        // const credentials2 = { email: 'player2@player2.com', password: '!Q2w3e4r' };

        await page1.goto('http://localhost:3000');
        await page2.goto('http://localhost:3000');
        await page3.goto('http://localhost:3000');
        await page4.goto('http://localhost:3000');
        // page1.waitForTimeout(7000);

        await page1.waitForURL(/.*\/dashboard$/);
        await page2.waitForURL(/.*\/dashboard$/);
        await page3.waitForURL(/.*\/dashboard$/);
        await page4.waitForURL(/.*\/dashboard$/);
        // const url2 = page2.url();
        
        expect(page1.url()).toMatch(/\/dashboard$/);
        expect(page2.url()).toMatch(/\/dashboard$/);
        expect(page3.url()).toMatch(/\/dashboard$/);
        expect(page4.url()).toMatch(/\/dashboard$/);
        // expect(url2).toMatch(/\/dashboard$/);
    })
})
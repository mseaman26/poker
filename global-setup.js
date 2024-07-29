import { chromium, expect } from "@playwright/test";

async function globalSetup() {
    console.log('Global setup');
    const browser = await chromium.launch();
    const context1 = await browser.   newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const credentials1 = { email: 'player1@player1.com', password: '!Q2w3e4r' };
    // const credentials2 = { email: 'player2@player2.com', password: '!Q2w3e4r' };

    // Function to perform login
    const login = async (page, { email, password }) => {
        await page.goto('http://localhost:3000');
        await page.fill('input[name="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await page.waitForURL(/.*\/dashboard$/); // Ensure the URL ends with /dashboard
    };

    // Perform logins in parallel
    await Promise.all([
        login(page1, credentials1),
        // login(page2, credentials2),
    ]);

    // Verify both users are on the dashboard
    page1.waitForURL(/.*\/dashboard$/);
    // const url2 = page2.url();

    expect(page1.url()).toMatch(/\/dashboard$/);
    // expect(url2).toMatch(/\/dashboard$/);

    //save state

    await page1.context().storageState({ path: './tests/e2e/auth/state/player1State.json' });
    // await page2.context().storageState({ path: './tests/e2e/auth/state/player2State.json' });

    await browser.close();
}

export default globalSetup;
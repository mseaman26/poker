const { test, expect } = require('@playwright/test');

test.describe('Login as Multiple Users', () => {
    test('should log in as both player1 and player2 simultaneously', async ({ browser }) => {
        // Create two browser contexts to simulate two separate users
        const context1 = await browser.newContext();
        const context2 = await browser.newContext();

        // Create two pages, one for each context
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        // Define login credentials
        const credentials1 = { email: 'player1@player1.com', password: '!Q2w3e4r' };
        const credentials2 = { email: 'player2@player2.com', password: '!Q2w3e4r' };

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
            login(page2, credentials2),
        ]);

        // Verify both users are on the dashboard
        const url1 = page1.url();
        const url2 = page2.url();

        expect(url1).toMatch(/\/dashboard$/);
        expect(url2).toMatch(/\/dashboard$/);

        const navigateToGamePage = async (page) => {
            const pageContainer = page.locator('div.pageContainer');
            const gamesLink = pageContainer.locator('a:has-text("GAMES")');
            await gamesLink.click();
            await page.waitForURL(/.*\/games$/);
        }

        // Navigate to the games page for both users
        await Promise.all([
            navigateToGamePage(page1),
            navigateToGamePage(page2),
        ]);

        // Verify both users are on the games page
        const gamesUrl1 = page1.url();
        const gamesUrl2 = page2.url();

        expect(gamesUrl1).toMatch(/\/games$/);
        expect(gamesUrl2).toMatch(/\/games$/);

        // Optionally, you can also perform additional assertions on each user's dashboard
        // e.g., checking if specific elements are present or unique to each user
    });
});

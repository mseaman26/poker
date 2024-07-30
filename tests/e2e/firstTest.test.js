const { test, expect } = require('@playwright/test');

test.describe('Login as Multiple Users', () => {
    test.setTimeout(360000); 
    test.use({ actionTimeout: 60000 }); //12 sec action timeout
    test('should log in as both player1 and player2 simultaneously', async ({ browser }) => {
        

        // Create two browser contexts to simulate two separate users
        const context1 = await browser.newContext()
        const context2 = await browser.newContext()

        // Create two pages, one for each context
        const page1 = await context1.newPage();
        const page2 = await context2.newPage();

        //if a confirm box appears, click ok
        page1.on('dialog', async dialog => {
            await dialog.accept();
        });

        // Define login credentials
        const credentials1 = { email: 'player1@player1.com', password: '!Q2w3e4r' };
        const credentials2 = { email: 'player2@player2.com', password: '!Q2w3e4r' };

        // Function to perform login
        const login = async (page, { email, password }) => {
            await page.goto('http://localhost:3000');
            await page.fill('input[name="email"]', email);
            await page.fill('input[type="password"]', password);
            await page.waitForSelector('button[type="submit"]')
            await page.click('button[type="submit"]');
            await page.waitForURL(/.*\/dashboard$/); // Ensure the URL ends with /dashboard
        };
        

        // Perform logins in parallel
        await Promise.all([
            login(page1, credentials1),
            login(page2, credentials2),
        ]);
        console.log('two players logged in')
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
        console.log('both players on games page')
        // Verify both users are on the games page
        const gamesUrl1 = page1.url();
        const gamesUrl2 = page2.url();

        expect(gamesUrl1).toMatch(/\/games$/);
        expect(gamesUrl2).toMatch(/\/games$/);

        const clickOnGame = async (page) => {
            //click on anchor element that has an h1 as a child with text 'mike's great game'
            const anchorLocator = page.locator('a:has(h1:text("playwright1"))');
            
            await anchorLocator.click();
            await page.waitForURL(/.*\/game\//);
        }

        // Click on the game for both users
        await Promise.all([
            clickOnGame(page1),
            clickOnGame(page2),
        ]);
        //check that both players are on the same page and that the url contains /game/
        expect(page1.url()).toMatch(/.*\/game\//);
        expect(page2.url()).toMatch(/.*\/game\//);
        //function for clicking on 'Enter Game' button
        const clickEnterGame = async (page) => {
            await page.waitForSelector('button:has-text("Enter Game")')
            
            const enterGameButton = page.locator('button:has-text("Enter Game")');
            await enterGameButton.click();
            // Optionally, wait for some confirmation or navigation after clicking
            await page.waitForURL(/.*\/play$/);

        }

        // Ensure Player 1 enters the game before Player 2 and ensure both are on the play page
        
        await clickEnterGame(page1),
        await clickEnterGame(page2),

        console.log('both players in game room')
    
        //check that url ends with /play
        expect(page1.url()).toMatch(/.*\/play$/);
        expect(page2.url()).toMatch(/.*\/play$/);

        //select the element with a data property of usersInRoom
        await page1.waitForSelector('[data-testId="usersInRoom"]')
        const usersInRoom = page1.locator('[data-testId="usersInRoom"]');
        //check the element is visible
        expect(await usersInRoom.isVisible()).toBeTruthy();
        //check that usersInRoom has two spans as children
        //wait until page is fully stable
        console.log('Before waiting for load state');
        await page2.waitForLoadState('networkidle');
        console.log('After waiting for load state');
        expect(await usersInRoom.locator('span').count()).toBe(2);
        //check that the first span has text 'player1'
        expect(await usersInRoom.locator('span').first().textContent()).toBe('player1');
        //page1 should have visible button with text that starts with 'Start New'
        const startNewGameButton = page1.locator('button:has-text("Start New")');
        expect(await startNewGameButton.isVisible()).toBeTruthy();
        //page2 should not have a button with text that starts with 'Start New'
        const startNewGameButton2 = page2.locator('button:has-text("Start New")');
        expect(await startNewGameButton2.isVisible()).toBeFalsy();
        //click on the start new game button
        //page1 should have a visible elemt with a data-testid of 'testCheckbox"'
        const testCheckbox = page1.locator('[data-testid="testCheckbox"]');
        await testCheckbox.waitFor({ state: 'visible' });
        expect(await testCheckbox.isVisible()).toBeTruthy();
        await startNewGameButton.click();
        // //click ok on the alert, not cancel
        await page1.waitForLoadState('networkidle');
        await page2.waitForLoadState('networkidle');
        console.log('game started')
        // //page 2 should have a visible element with a data-testId of 'myTurnContainer'
        //pause test for inspection
        
        const myTurnPopUps = page2.locator('[data-testid="myTurnPopup"]');
        const myTurnPopUp = myTurnPopUps.nth(0);
        // await page1.pause();
        await myTurnPopUp.waitFor({ state: 'visible' });
        
        expect(await myTurnPopUp.isVisible()).toBeTruthy();

        //there should be a button that matches id="react-burger-menu-btn" on page 1
        page1.waitForSelector('button#react-burger-menu-btn');
        const burgerMenuButton = page1.locator('button#react-burger-menu-btn');
        expect(await burgerMenuButton.isVisible()).toBeTruthy();
        //click on the burger menu button
        await burgerMenuButton.click();
        //pause page1
        // await page1.pause();
        //there should be a button that matches data-testid="endGameButton" on page 1, check it's visibility
        page1.waitForSelector('div[data-testid="endGameButton"]');
        const endGameButton = page1.locator('div[data-testid="endGameButton"]');
        expect(await endGameButton.isVisible()).toBeTruthy();
        //click on the end game button
        await endGameButton.click();
        


    });
});

const { test, expect } = require('@playwright/test');

test.describe('8 Players', () => {
    test('should log in as 8 players simultaneously', async ({ browser }) => {
        const context1 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context2 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context3 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context4 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context5 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context6 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context7 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });
        const context8 = await browser.newContext({
            viewport: { width: 1280, height: 720 }
        });

        const page1 = await context1.newPage();
        const page2 = await context2.newPage();
        const page3 = await context3.newPage();
        const page4 = await context4.newPage();
        const page5 = await context5.newPage();
        const page6 = await context6.newPage();
        const page7 = await context7.newPage();
        const page8 = await context8.newPage();

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

        page5.on('dialog', async dialog => {
            await dialog.accept();
        });

        page6.on('dialog', async dialog => {
            await dialog.accept();
        });

        page7.on('dialog', async dialog => {
            await dialog.accept();
        });

        page8.on('dialog', async dialog => {
            await dialog.accept();
        });
        //navigate to the register page by clicking on the link with text "Register"
        const navigateToRegisterPage = async (page) => {
            await page.goto('http://localhost:3000');
            const registerLink = page.locator('a:has-text("Register")');
            await registerLink.click();
            await page.waitForURL(/.*\/register$/);
        }

        await Promise.all([
            navigateToRegisterPage(page1),
            navigateToRegisterPage(page2),
            navigateToRegisterPage(page3),
            navigateToRegisterPage(page4),
            navigateToRegisterPage(page5),
            navigateToRegisterPage(page6),
            navigateToRegisterPage(page7),
            navigateToRegisterPage(page8),
        ]);
        //define new user credentials
        const credentials1 = { 
            email: 'test1@test1.com', 
            password: '!Q2w3e4r', 
            name: 'test1' };
        const credentials2 = { 
            email: 'test2@test2.com',
            password: '!Q2w3e4r',
            name: 'test2'
        }
        const credentials3 = { 
            email: 'test3@test3.com',
            password: '!Q2w3e4r',
            name: 'test3'
        }
        const credentials4 = { 
            email: 'test4@test4.com',
            password: '!Q2w3e4r',
            name: 'test4'
        }
        const credentials5 = { 
            email: 'test5@test5.com',
            password: '!Q2w3e4r',
            name: 'test5'
        }
        const credentials6 = { 
            email: 'test6@test6.com',
            password: '!Q2w3e4r',
            name: 'test6'
        }
        const credentials7 = { 
            email: 'test7@test7.com',
            password: '!Q2w3e4r',
            name: 'test7'
        }
        const credentials8 = { 
            email: 'test8@test8.com',
            password: '!Q2w3e4r',
            name: 'test8'
        }
        //register new users
        const register = async (page, { email, password, name }) => {
            await page.fill('input[name="name"]', name);
            await page.fill('input[name="email"]', email);
            await page.fill('input[name="password1"]', password);
            await page.fill('input[name="password2"]', password);
            //wait for network idle
            await page.waitForLoadState('networkidle');
            //wait for an element with testId emailAvailable to be visible
            await page.waitForSelector('[data-testid="emailAvailable"]');
            await page.click('button[type="submit"]');
            await page.waitForURL(/.*\/dashboard$/);
        }
        //register all users in parallel
        await Promise.all([
            register(page1, credentials1),
            register(page2, credentials2),
            register(page3, credentials3),
            register(page4, credentials4),
            register(page5, credentials5),
            register(page6, credentials6),
            register(page7, credentials7),
            register(page8, credentials8),
        ]);
        //verify all users are on the dashboard
        const url1 = page1.url();
        const url2 = page2.url();
        const url3 = page3.url();
        const url4 = page4.url();
        const url5 = page5.url();
        const url6 = page6.url();
        const url7 = page7.url();
        const url8 = page8.url();

        expect(url1).toMatch(/\/dashboard$/);
        expect(url2).toMatch(/\/dashboard$/);
        expect(url3).toMatch(/\/dashboard$/);
        expect(url4).toMatch(/\/dashboard$/);
        expect(url5).toMatch(/\/dashboard$/);
        expect(url6).toMatch(/\/dashboard$/);
        expect(url7).toMatch(/\/dashboard$/);
        expect(url8).toMatch(/\/dashboard$/);

        //navigate to //games by clicking on the link with text "GAMES"
        const navigateToGames = async (page) => {
            const pageContainer = page.locator('div.pageContainer');
            const gamesLink = pageContainer.locator('a:has-text("GAMES")');
            await gamesLink.click();
            await page.waitForURL(/.*\/games$/);
        }
        //navigate to games for all users
        await Promise.all([
            navigateToGames(page1),
            navigateToGames(page2),
            navigateToGames(page3),
            navigateToGames(page4),
            navigateToGames(page5),
            navigateToGames(page6),
            navigateToGames(page7),
            navigateToGames(page8),
        ]);

        // test1 clicks on a button with text that starts with 'Create New Game'
        const goToCreateNewGame = async (page) => {
            //select button with data-testid="createGameButton" attribute
            const createGameButton = await page.waitForSelector('[data-testid="createGameButton"]');
      

            await createGameButton.click();
            await page.waitForURL(/.*\/createGame$/);
        }
        //click on create new game (just test1)
        await goToCreateNewGame(page1);
        //verify test1 is on the create game page
        expect(page1.url()).toMatch(/.*\/createGame$/);
        //select the input with the name gameName
        const gameNameInput = await page1.waitForSelector('input[name="gameName"]');
        //select the input with the name buyIn
        const buyInInput = await page1.waitForSelector('input[name="buyIn"]');
        //select the input with the name bigBlinds
        const bigBlindsInput = await page1.waitForSelector('input[name="bigBlinds"]');
        const createGameButton = await page1.waitForSelector('button[type="submit"]');
        //fill in the game name input
        await gameNameInput.fill('test1PlaywrightGame');
        //fill in the buy in input
        await buyInInput.fill('100');
        //fill in the big blinds input
        await bigBlindsInput.fill('2');
        //click on the submit button

        //click on the submit button
        await createGameButton.click();
 
        //wait for url to contain /game/:gameId
        await page1.waitForURL(/.*\/game\//);
        //wait for an h1 element with the text 'test1PlaywrightGame'
        const gameHeader = await page1.waitForSelector('h1:has-text("test1PlaywrightGame")');
        //verify the game header is visible
        expect(gameHeader).not.toBeNull();
        //wait for network idle
        await page1.waitForLoadState('networkidle');
        //on page1 type 'test' into the only input element on the page
        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test2-invite"]');
        await page1.click('button[data-testid="test2-invite"]');
        //wait 500ms
        await page1.waitForTimeout(500);
        
        await page1.waitForSelector('input');

        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test3-invite"]');
        await page1.click('button[data-testid="test3-invite"]');
        await page1.waitForTimeout(500);
        await page1.waitForSelector('input');

        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test4-invite"]');
        await page1.click('button[data-testid="test4-invite"]');
        await page1.waitForTimeout(500);
        await page1.waitForSelector('input');
        
        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test5-invite"]');
        await page1.click('button[data-testid="test5-invite"]');
        await page1.waitForTimeout(500);
        await page1.waitForSelector('input');

        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test6-invite"]');
        await page1.click('button[data-testid="test6-invite"]');
        await page1.waitForTimeout(500);
        await page1.waitForSelector('input');

        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test7-invite"]');
        await page1.click('button[data-testid="test7-invite"]');
        await page1.waitForTimeout(500);
        await page1.waitForSelector('input');

        await page1.fill('input', 'test');
        await page1.waitForLoadState('networkidle');
        await page1.waitForSelector('button[data-testid="test8-invite"]');
        await page1.click('button[data-testid="test8-invite"]');
        //refresh pages2-8
        await page2.reload();
        await page3.reload();
        await page4.reload();
        await page5.reload();
        await page6.reload();
        await page7.reload();
        await page8.reload();

       //pause page1
       await page8.pause();
    
        
       




        
        //navigate to //account by changing url
        const navigateToAccount = async (page) => {
            await page.goto('http://localhost:3000/account');
            await page.waitForURL(/.*\/account$/);
        }
        //navigate to account for all users
        await Promise.all([
            navigateToAccount(page1),
            navigateToAccount(page2),
            navigateToAccount(page3),
            navigateToAccount(page4),
            navigateToAccount(page5),
            navigateToAccount(page6),
            navigateToAccount(page7),
            navigateToAccount(page8),
        ]);
        //click button with text 'Delete Account'
        const deleteAccount = async (page) => {
            await page.click('button:has-text("Delete Account")');
            //check for a visible element that is a button with the text 'Login'

            await page.waitForSelector('button:has-text("Login")');
        }
        //delete account for all users
        await Promise.all([
            deleteAccount(page1),
            deleteAccount(page2),
            deleteAccount(page3),
            deleteAccount(page4),
            deleteAccount(page5),
            deleteAccount(page6),
            deleteAccount(page7),
            deleteAccount(page8),
        ]);

    })
});
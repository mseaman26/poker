const { test, expect } = require('@playwright/test');


test.describe('8 Players', () => {
    test.setTimeout(360000); //6 min
    test.use({ actionTimeout: 12000 }); //12 sec action timeout
    test('should log in as 8 players simultaneously and then 8 more', async ({ browser }) => {
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
        console.log('8 contexts created')
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
        console.log('8 pages created')
        //navigate to the register page by clicking on the link with text "Register"
        const navigateToRegisterPage = async (page) => {
            await page.goto('http://localhost:3000');
            await page.waitForSelector('a:has-text("Register")');
            await page.click('a:has-text("Register")');
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
        console.log('all players on registration page')
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
        console.log('players 1-8 registered');
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
        console.log('all players on games page')
        // test1 clicks on a button with text that starts with 'Create New Game'
        const goToCreateNewGame = async (page) => {
            //select button with data-testid="createGameButton" attribute
            await page.waitForSelector('[data-testid="createGameButton"]');
            await page.click('[data-testid="createGameButton"]');
            await page.waitForURL(/.*\/createGame$/);
        }
        //click on create new game (just test1)
        await goToCreateNewGame(page1);
        

        const createGame = async (page, gameName, buyIn, bigBlinds) => {
            const gameNameInput = await page.waitForSelector('input[name="gameName"]');
            //select the input with the name buyIn
            const buyInInput = await page.waitForSelector('input[name="buyIn"]');
            //select the input with the name bigBlinds
            const bigBlindsInput = await page.waitForSelector('input[name="bigBlinds"]');
            const createGameButton = await page.waitForSelector('button[type="submit"]');
            //fill in the game name input
            await gameNameInput.fill(gameName);
            //fill in the buy in input
            await buyInInput.fill(buyIn);
            //fill in the big blinds input
            await bigBlindsInput.fill(bigBlinds);
            //click on the submit button

            //click on the submit button
            await createGameButton.click();
    
            //wait for url to contain /game/:gameId
            await page.waitForURL(/.*\/game\//);
            //wait for an h1 element with the text 'test1PlaywrightGame'
            const selectorText = `h1:has-text("${gameName}")`;
            const gameHeader = await page.waitForSelector(selectorText);
            //verify the game header is visible
            expect(gameHeader).not.toBeNull();
            //wait for network idle
            await page.waitForLoadState('networkidle');
        }
        //select the input with the name gameName
        await createGame(page1, 'test1PlaywrightGame', '100', '2');
        console.log('game1 created')
        //on page1 type 'test' into the only input element on the page
        const searchAndInvite = async (page, searchText, inviteeName) => {
            await page.waitForSelector('input');
            await page.waitForLoadState('networkidle');
            //wait for input to be empty of text
            await page.fill('input', '');
            await page.fill('input', searchText);
            await page.waitForLoadState('networkidle');
            await page.waitForSelector(`button[data-testid="${inviteeName}-invite"]`);
            await page.click(`button[data-testid="${inviteeName}-invite"]`);
            //wait 500ms
            await page1.waitForTimeout(500);
            //wait for network idle
            await page.waitForLoadState('networkidle');
        }
        
        await searchAndInvite(page1, 'test', 'test2');
        await searchAndInvite(page1, 'test', 'test3');
        await searchAndInvite(page1, 'test', 'test4');
        await searchAndInvite(page1, 'test', 'test5');
        await searchAndInvite(page1, 'test', 'test6');
        await searchAndInvite(page1, 'test', 'test7');
        await searchAndInvite(page1, 'test', 'test8');
        console.log('7 players invited')
        //refresh pages2-8
        await page2.reload();
        await page2.waitForTimeout(100);
        await page3.reload();
        await page3.waitForTimeout(100);
        await page4.reload();
        await page4.waitForTimeout(100);
        await page5.reload();
        await page5.waitForTimeout(100);
        await page6.reload();
        await page6.waitForTimeout(100);
        await page7.reload();
        await page7.waitForTimeout(100);
        await page8.reload();

        page1.locator('button:has-text("Enter Game")').click();
        //check that url ends with /play
        await page1.waitForURL(/.*\/play$/);
        //function for clicking on invited game and then clicking Enter Game Button
        const clickOnAndEnterGame = async (page, gameName) => {
            //click on the a with a h1 child that says 'test1PlaywrightGame'
            await page.waitForSelector(`a:has(h1:text("${gameName}"))`);
            await page.click(`a:has(h1:text("${gameName}"))`);
            //wait for the url to contain /game
            await page.waitForURL(/.*\/game/);
            //click on the button with the text 'Enter Game'
            await page.waitForSelector('button:has-text("Enter Game")');
            await page.click('button:has-text("Enter Game")');
            //wait for the url to contain /play
            await page.waitForURL(/.*\/play$/);
        }
        //click on the game for users 2-8 in order
        await clickOnAndEnterGame(page2, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page3, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page4, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page5, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page6, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page7, 'test1PlaywrightGame');
        await clickOnAndEnterGame(page8, 'test1PlaywrightGame');

        console.log('players 1-8 entered game');

        const startNewTestGame = async (page) => {
            const startNewGameButton = page.locator('button:has-text("Start New")');
            expect(await startNewGameButton.isVisible()).toBeTruthy();

            const testCheckbox = page.locator('[data-testid="testCheckbox"]');
            await testCheckbox.waitFor({ state: 'visible' });
            await testCheckbox.click();
            expect(await testCheckbox.isVisible()).toBeTruthy();
            await startNewGameButton.click();
            // //click ok on the alert, not cancel
            await page.waitForLoadState('networkidle');
        }

        await startNewTestGame(page1);

        const checkForMyTurnPopUp = async (page) => {
            const myTurnPopUps = page.locator('[data-testid="myTurnPopup"]');
            const myTurnPopUp = myTurnPopUps.nth(0);
            // await page1.pause();
            await myTurnPopUp.waitFor({ state: 'visible' });
            expect(await myTurnPopUp.isVisible()).toBeTruthy();
        }
        await checkForMyTurnPopUp(page4);
        console.log('pop up displayed for player 4');
        //pause
        // await page1.pause();
        //create 8 more contexts and pages
        // const context9 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context10 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context11 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context12 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context13 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context14 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context15 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });
        // const context16 = await browser.newContext({
        //     viewport: { width: 1280, height: 720 }
        // });

        // const page9 = await context9.newPage();
        // const page10 = await context10.newPage();
        // const page11 = await context11.newPage();
        // const page12 = await context12.newPage();
        // const page13 = await context13.newPage();
        // const page14 = await context14.newPage();
        // const page15 = await context15.newPage();
        // const page16 = await context16.newPage();

        // page9.on('dialog', async dialog => {
        //     await dialog.accept();
        // });
        // page10.on('dialog', async dialog => {
        //     await dialog.accept();
        // });
        // page11.on('dialog', async dialog => {
        //     await dialog.accept();
        // })
        // page12.on('dialog', async dialog => {
        //     await dialog.accept();
        // })
        // page13.on('dialog', async dialog => {
        //     await dialog.accept();
        // })
        // page14.on('dialog', async dialog => {
        //     await dialog.accept();
        // })
        // page15.on('dialog', async dialog => {
        //     await dialog.accept();
        // })
        // page16.on('dialog', async dialog => {
        //     await dialog.accept();
        // })

        // //register new users
        // const credentials9 = { email: 'test9@test9.com',name: 'test9',password: '!Q2w3e4r' };
        // const credentials10 = { email: 'test10@test10.com',name: 'test10',password: '!Q2w3e4'};
        // const credentials11 = { email: 'test11@test11.com', name: 'test11', password: '!Q2w3e4r' };
        // const credentials12 = { email: 'test12@test12.com', name: 'test12', password: '!Q2w3e4r' };
        // const credentials13 = { email: 'test13@test13.com', name: 'test13', password: '!Q2w3e4r' };
        // const credentials14 = { email: 'test14@test14.com', name: 'test14', password: '!Q2w3e4r' };
        // const credentials15 = { email: 'test15@test15.com', name: 'test15', password: '!Q2w3e4r' };
        // const credentials16 = { email: 'test16@test16.com', name: 'test16', password: '!Q2w3e4r' };

        // await Promise.all([
        //     navigateToRegisterPage(page9),
        //     navigateToRegisterPage(page10),
        //     navigateToRegisterPage(page11),
        //     navigateToRegisterPage(page12),
        //     navigateToRegisterPage(page13),
        //     navigateToRegisterPage(page14),
        //     navigateToRegisterPage(page15),
        //     navigateToRegisterPage(page16),
        // ]);

        // await Promise.all([
        //     register(page9, credentials9),
        //     register(page10, credentials10),
        //     register(page11, credentials11),
        //     register(page12, credentials12),
        //     register(page13, credentials13),
        //     register(page14, credentials14),
        //     register(page15, credentials15),
        //     register(page16, credentials16),
        // ]);
        // console.log('players 9-16 registered');
        // const url9 = page9.url();
        // const url10 = page10.url();
        // const url11 = page11.url();
        // const url12 = page12.url();
        // const url13 = page13.url();
        // const url14 = page14.url();
        // const url15 = page15.url();
        // const url16 = page16.url();

        // expect(url9).toMatch(/\/dashboard$/);
        // expect(url10).toMatch(/\/dashboard$/);
        // expect(url11).toMatch(/\/dashboard$/);
        // expect(url12).toMatch(/\/dashboard$/);
        // expect(url13).toMatch(/\/dashboard$/);
        // expect(url14).toMatch(/\/dashboard$/);
        // expect(url15).toMatch(/\/dashboard$/);
        // expect(url16).toMatch(/\/dashboard$/);



        // await Promise.all([
        //     navigateToGames(page9),
        //     navigateToGames(page10),
        //     navigateToGames(page11),
        //     navigateToGames(page12),
        //     navigateToGames(page13),
        //     navigateToGames(page14),
        //     navigateToGames(page15),
        //     navigateToGames(page16),
        // ]);

        // await goToCreateNewGame(page9);
        // await createGame(page9, 'test9PlaywrightGame', '100', '2');
        // console.log('game9 created');
        // await searchAndInvite(page9, 'test', 'test10');
        // console.log('player 10 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test11');
        // console.log('player 11 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test12');
        // console.log('player 12 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test13');
        // console.log('player 13 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test14');
        // console.log('player 14 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test15');
        // console.log('player 15 invited to game 9');
        // await searchAndInvite(page9, 'test', 'test16');
        // console.log('players 9-16 invited to game 9');

        // await page10.reload();
        // await page10.waitForTimeout(100);
        // await page11.reload();
        // await page11.waitForTimeout(100);
        // await page12.reload();
        // await page12.waitForTimeout(100);
        // await page13.reload();
        // await page13.waitForTimeout(100);
        // await page14.reload();
        // await page14.waitForTimeout(100);
        // await page15.reload();
        // await page15.waitForTimeout(100);
        // await page16.reload();

        // page9.locator('button:has-text("Enter Game")').click();
        // //check that url ends with /play
        // await page9.waitForURL(/.*\/play$/);
        // console.log('player 9 entered game 9');
        // await clickOnAndEnterGame(page10, 'test9PlaywrightGame');
        // console.log('player 10 entered game 9');
        // await clickOnAndEnterGame(page11, 'test9PlaywrightGame');
        // console.log('player 11 entered game 9');
        // await clickOnAndEnterGame(page12, 'test9PlaywrightGame');
        // console.log('player 12 entered game 9');
        // await clickOnAndEnterGame(page13, 'test9PlaywrightGame');
        // console.log('player 13 entered game 9');
        // await clickOnAndEnterGame(page14, 'test9PlaywrightGame');
        // console.log('player 14 entered game 9');
        // await clickOnAndEnterGame(page15, 'test9PlaywrightGame');
        // console.log('player 15 entered game 9');
        // await clickOnAndEnterGame(page16, 'test9PlaywrightGame');
        // console.log('player 16 entered game 9');

        // await startNewTestGame(page9);














    
        
       




        
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
            // navigateToAccount(page9),
            // navigateToAccount(page10),
            // navigateToAccount(page11),
            // navigateToAccount(page12),
            // navigateToAccount(page13),
            // navigateToAccount(page14),
            // navigateToAccount(page15),
            // navigateToAccount(page16),
        ]);
        console.log('all players on account page')
        //click button with text 'Delete Account'
        const deleteAccount = async (page) => {
            await page.waitForSelector('button:has-text("Delete Account")')
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
            // deleteAccount(page9),
            // deleteAccount(page10),
            // deleteAccount(page11),
            // deleteAccount(page12),
            // deleteAccount(page13),
            // deleteAccount(page14),
            // deleteAccount(page15),
            // deleteAccount(page16),

        ]);
        console.log('all accounts deleted')
        await Promise.all([
            page1.close(),
            page2.close(),
            page3.close(),
            page4.close(),
            page5.close(),
            page6.close(),
            page7.close(),
            await page8.waitForTimeout(1000),
            page8.close(),
            // page9.close(),
            // page10.close(),
            // page11.close(),
            // page12.close(),
            // page13.close(),
            // page14.close(),
            // page15.close(),
            // page16.close(),
            await context1.close(),
            await context2.close(),
            await context3.close(),
            await context4.close(),
            await context5.close(),
            await context6.close(),
            await context7.close(),
            await context8.close(),
            
        ]);

        //assure everything is cleaned up
        const allContexts = browser.contexts();
        expect(allContexts.length).toBe(0);


        
        await browser.close()
    })
});
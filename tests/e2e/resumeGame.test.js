const { test, expect, chromium } = require('@playwright/test');
require('dotenv').config({ path: '.env.local' }); 

test.describe('Resume Game Test', () => {
    test.setTimeout(360000); //6 min
    test.use({ actionTimeout: 24000 }); //12 sec action timeout
    test('should resume a game', async ({page}) => {
        const browser = await chromium.launch();
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
        console.log('pages created')
        async function getToGamePage(page) {
      
            await page.goto(process.env.PLAYWRIGHT_BASE_URL);
            await page.goto(`${process.env.PLAYWRIGHT_BASE_URL}/game/66a82d098bb0a524d7efd3cf/play`)
            await page.url(/\/game\/[a-z0-9]{24}\/play$/)
            //expect url to contain 'play' anywhere in the url
            expect(page.url()).toContain('play');

        }

        await getToGamePage(page1);
        await getToGamePage(page2);
        await getToGamePage(page3);
        await getToGamePage(page4);
        console.log('4 players in game room')

      
        if(process.env.PLAYWRIGHT_BASE_URL.includes('localhost')) {
            await page1.waitForSelector('[data-testid="testCheckbox"]');
            const testCheckbox = page1.locator('[data-testid="testCheckbox"]');
           // expect(await startNewGameButton.isVisible()).toBeTruthy();
            expect(await testCheckbox.isVisible()).toBeTruthy();
            await testCheckbox.check();

        }

        await page1.waitForSelector('[data-testid="startGameButton"]');
        await page1.waitForSelector('span:has-text("testuser1")')
        await page1.waitForSelector('span:has-text("testuser2")')
        await page1.waitForSelector('span:has-text("testuser3")')
        await page1.waitForSelector('span:has-text("testuser4")')
        const startGameButton = page1.locator('[data-testid="startGameButton"]');
        await startGameButton.click();
        console.log('game started')
        
        const checkForMyTurnPopUp = async (page) => {
            const myTurnPopUps = page.locator('[data-testid="myTurnPopup"]');
            const myTurnPopUp = myTurnPopUps.nth(0);
            // await page1.pause();
            await myTurnPopUp.waitFor({ state: 'visible' });
            expect(await myTurnPopUp.isVisible()).toBeTruthy();
        }

        await checkForMyTurnPopUp(page4);
        const endGame = async (page) => {
            page.waitForSelector('button#react-burger-menu-btn');
            const burgerMenuButton = page.locator('button#react-burger-menu-btn');
            expect(await burgerMenuButton.isVisible()).toBeTruthy();
            await burgerMenuButton.click();
            page1.waitForSelector('div[data-testid="endGameButton"]');
            const endGameButton = page1.locator('div[data-testid="endGameButton"]');
            expect(await endGameButton.isVisible()).toBeTruthy();
            await endGameButton.click();
            //wait for network idle
            await page.waitForLoadState('networkidle');
            await page.waitForTimeout(1000);
        }
        

        const raise = async (page, amount, positionIndex) => {
            //select all buttons with text Raise
            
            await page.waitForSelector('button:has-text("Raise")');
            const raiseButton = page.locator('button:has-text("Raise")').nth(positionIndex);
            expect(raiseButton.isVisible()).toBeTruthy();
            console.log('raise button visible')
            await raiseButton.waitFor({ state: 'visible' });
            await page.waitForTimeout(500);
            await raiseButton.click();
            
            await page.waitForSelector('input');
            const raiseInput = page.locator('input');
            await raiseInput.fill(amount);
            //wait for button with type submit
            page.waitForSelector('button[type="submit"]');
            const submitButton = page.locator('button[type="submit"]');
            await submitButton.click();
        }

        await raise(page4, '5', 3);

        const fold = async (page) => {
            //select all buttons with text Fold
            await page.waitForSelector('button:has-text("Fold")');
            const foldButton = page.locator('button:has-text("Fold")').nth(3);
            expect(foldButton.isVisible()).toBeTruthy();
            await foldButton.waitFor({ state: 'visible' });
            await foldButton.click();
        }

        await checkForMyTurnPopUp(page1);
        await fold(page1);

        await checkForMyTurnPopUp(page2);
        const call = async (page) => {
            //select all buttons with text Call
            await page.waitForSelector('button:has-text("Call")');
            const callButton = page.locator('button:has-text("Call")').nth(3);
            expect(callButton.isVisible()).toBeTruthy();
            await callButton.waitFor({ state: 'visible' });
            await callButton.click();
        }

        await call(page2);

        await checkForMyTurnPopUp(page3);
        await fold(page3);

        //next round

        const check = async (page) => {
            //select all buttons with text Check
            await page.waitForSelector('button:has-text("Check")');
            const checkButton = page.locator('button:has-text("Check")').nth(3);
            expect(checkButton.isVisible()).toBeTruthy();
            checkButton.click();
        }

        await checkForMyTurnPopUp(page2);
        await check(page2);

        await checkForMyTurnPopUp(page4);

        const allIn = async (page) => {
            //select all buttons with text All In
            await page.waitForSelector('button:has-text("All In")');
            const allInButton = page.locator('button:has-text("All In")').nth(3);
            expect(allInButton.isVisible()).toBeTruthy();
            await allInButton.click();
        }

        await allIn(page4);

        await checkForMyTurnPopUp(page2);
        await allIn(page2);

        //on page3 wait for selector with data-testId 'otherPlayer_testuser4' and find a child that is an 
        await page3.waitForSelector('[data-testid="otherPlayer_testuser4"]')
        await page3.waitForSelector('[data-testid="otherPlayer_testuser4"] h1:text("Winner!!")')
        await page3.waitForSelector('[data-testid="otherPlayer_testuser2"] h1:text("Winner!!")')
        // await page1.waitForSelector('button:has-text("Show your Cards?")')
        // page1.locator('button:has-text("Show your Cards?")').click()
        await page3.waitForSelector('button:has-text("Show your Cards?")')
        let showCardsButton = page3.locator('button:has-text("Show your Cards?")')

        await showCardsButton.click()
        console.log('show cards button clicked')
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] img[src="/_next/static/media/clubs_2.9c66a404.svg"]`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] img[src="/_next/static/media/clubs_9.eb52831f.svg"]`)

        console.log('flip cards visible')
        
        await endGame(page1);
        await page1.waitForSelector('button:has-text("Resume Game")');
        const resumeGameButton = page1.locator('button:has-text("Resume Game")');
        await resumeGameButton.click();
        

        await page1.waitForSelector(`[data-testid="otherPlayer_testuser2"] span:has-text("101")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] span:has-text("98")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser4"] span:has-text("101")`)
        await page1.waitForSelector(`[data-testid="player_me"] span:has-text("100")`)

        await page1.waitForSelector('button:has-text("Next Hand")');
        const nextHandButton = page1.locator('button:has-text("Next Hand")');
        await nextHandButton.click();

        //slect element with data-testid 'otherPlayer_testuser2' and find a child that is an span with text data-testid 'otherDealerMarker' 
        
        await page1.waitForSelector('[data-testid="otherPlayer_testuser2"] span[data-testid="otherDealerMarker"]')
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser2"] span:has-text("101")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] span:has-text("97")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser4"] span:has-text("99")`)

        await checkForMyTurnPopUp(page1);
        await allIn(page1);
        await checkForMyTurnPopUp(page2);
        await allIn(page2);
        await checkForMyTurnPopUp(page3);
        await allIn(page3);
        await checkForMyTurnPopUp(page4);
        await allIn(page4);

        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] span:has-text("392")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser2"] span:has-text("8")`)

        await page1.waitForSelector('button:has-text("Next Hand")');
        const nextHandButton2 = page1.locator('button:has-text("Next Hand")');
        await nextHandButton2.click();

        await endGame(page1);
        await page1.waitForSelector('button:has-text("Resume Game")');
        const resumeGameButton2 = page1.locator('button:has-text("Resume Game")');
        await resumeGameButton2.click();

        await page1.waitForSelector(`[data-testid="otherPlayer_testuser2"] span:has-text("8")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] span:has-text("392")`)

        await page1.waitForSelector('button:has-text("Next Hand")');
        const nextHandButton3 = page1.locator('button:has-text("Next Hand")');
        await nextHandButton3.click();

        await page1.waitForSelector(`[data-testid="otherPlayer_testuser4"] span:has-text("(spectating)")`)
        await page1.waitForSelector(`[data-testid="player_me"] button:has-text("Buy in ($100)")`)
        const buyInButton = page1.locator('button:has-text("Buy in ($100)")');
        await buyInButton.click();

        await page1.waitForSelector(`[data-testid="player_me"] h1:has-text("You will be dealt in when the next hand starts!")`)
        await page2.waitForSelector(`[data-testid="otherPlayer_testuser1"] span:has-text("100")`)
        await fold(page2);
        await page1.waitForSelector('button:has-text("Next Hand")');
        const nextHandButton4 = page1.locator('button:has-text("Next Hand")');
        await nextHandButton4.click();
        
        await page1.waitForSelector(`[data-testid="player_me"] span:has-text("100")`)
        await fold(page1);
        await checkForMyTurnPopUp(page2);
        await fold(page2);
        await page1.waitForSelector('button:has-text("Next Hand")');
        const nextHandButton5 = page1.locator('button:has-text("Next Hand")');
        await nextHandButton5.click();

        await endGame(page1);
        await page1.waitForSelector('button:has-text("Resume Game")');
        const resumeGameButton3 = page1.locator('button:has-text("Resume Game")');
        await resumeGameButton3.click();

        await page1.waitForSelector(`[data-testid="otherPlayer_testuser2"] span:has-text("6")`)
        await page1.waitForSelector(`[data-testid="otherPlayer_testuser3"] span:has-text("394")`)
        await page1.waitForSelector(`[data-testid="player_me"] span:has-text("100")`)

        await page1.waitForSelector('button:has-text("Next Hand")');


        await endGame(page1);
        await page1.close();
        await page2.close();
        await page3.close();
        await page4.close();
    })

})
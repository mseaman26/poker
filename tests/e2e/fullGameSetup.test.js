const { test, expect, chromium } = require('@playwright/test');


test.describe('Full Game Setup', () => {
  test.setTimeout(360000); //6 min
  test.use({ actionTimeout: 12000 }); //12 sec action timeout
  test('should setup a full game', async ({page}) => {
    //define timeout for the test
    test.setTimeout(180000);
    const browser = await chromium.launch();
    const context1 = await browser.newContext({storageState: 'tests/e2e/auth/state/user1.json'});
    const context2 = await browser.newContext({storageState: 'tests/e2e/auth/state/user2.json'});
    const context3 = await browser.newContext({storageState: 'tests/e2e/auth/state/user3.json'});
    const context4 = await browser.newContext({storageState: 'tests/e2e/auth/state/user4.json'});
    const context5 = await browser.newContext({storageState: 'tests/e2e/auth/state/user5.json'});
    const context6 = await browser.newContext({storageState: 'tests/e2e/auth/state/user6.json'});
    const context7 = await browser.newContext({storageState: 'tests/e2e/auth/state/user7.json'});
    const context8 = await browser.newContext({storageState: 'tests/e2e/auth/state/user8.json'});
    const context9 = await browser.newContext({storageState: 'tests/e2e/auth/state/user9.json'});
    const context10 = await browser.newContext({storageState: 'tests/e2e/auth/state/user10.json'});

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    const page3 = await context3.newPage();
    const page4 = await context4.newPage();
    const page5 = await context5.newPage();
    const page6 = await context6.newPage();
    const page7 = await context7.newPage();
    const page8 = await context8.newPage();
    const page9 = await context9.newPage();
    const page10 = await context10.newPage();

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
    })
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
    page9.on('dialog', async dialog => {
      await dialog.accept();
    });
    page10.on('dialog', async dialog => {
      await dialog.accept();
    });


    async function openAuthenticatedUserPage(page, userNumber) {
      
      await page.goto('http://localhost:3000', {storageState: `tests/e2e/auth/state/user${userNumber}.json`});
      await page.waitForURL(/.*\/dashboard$/);
      expect(page.url()).toMatch(/\/dashboard$/);


    }
    await openAuthenticatedUserPage(page1, 1);
    await openAuthenticatedUserPage(page2, 2);
    await openAuthenticatedUserPage(page3, 3);
    await openAuthenticatedUserPage(page4, 4);
    await openAuthenticatedUserPage(page5, 5);
    await openAuthenticatedUserPage(page6, 6);
    await openAuthenticatedUserPage(page7, 7);
    await openAuthenticatedUserPage(page8, 8);
    await openAuthenticatedUserPage(page9, 9);
    await openAuthenticatedUserPage(page10, 10);

    //player 9 tries to join game without being invited
    console.log('player 9 tries to join game without being invited');
    await page9.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page9.waitForURL(/.*\/dashboard$/);
    expect(page9.url()).toMatch(/\/dashboard$/);
    
    console.log('joining 8 invited players');
    await page1.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page2.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page3.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page4.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page5.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page6.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page7.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page8.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    console.log('all players joined game');

    //player 9  attempts to join game again
    console.log('player 9  attempts to join game again'); 
    await page9.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page9.waitForURL(/.*\/dashboard$/);
    expect(page9.url()).toMatch(/\/dashboard$/);

    //invited player tries to join game after it is full
    console.log('invited player (10) tries to join game after it is full');
    await page10.goto('http://localhost:3000/game/66a82d098bb0a524d7efd3cf/play');
    await page10.waitForURL(/.*\/dashboard$/);

    //select element where data-testId="startGameButton
    await page1.waitForSelector('[data-testid="startGameButton"]');
    const startNewGameButton = page1.locator('[data-testid="startGameButton"]');
    const testCheckbox = page1.locator('[data-testid="testCheckbox"]');
    
    // expect(await startNewGameButton.isVisible()).toBeTruthy();
    expect(await testCheckbox.isVisible()).toBeTruthy();
    await testCheckbox.check();
    await startNewGameButton.click();
    
    await browser.close();
  })


  

});
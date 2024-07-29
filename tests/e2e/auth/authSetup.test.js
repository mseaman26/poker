
const { test: setup, expect, chromium } = require('@playwright/test');
require('dotenv').config({ path: '.env.local' }); 


// const credentials = [
//   { email: 'testuser1@testuser1.com', password: '!Q2w3e4r' },
//   { email: 'testuser2@testuser2.com', password: '!Q2w3e4r' },
//   { email: 'testuser3@testuser3.com', password: '!Q2w3e4r' },
//   { email: 'testuser4@testuser4.com', password: '!Q2w3e4r' },
//   { email: 'testuser5@testuser5.com', password: '!Q2w3e4r' },
//   { email: 'testuser6@testuser6.com', password: '!Q2w3e4r' },
//   { email: 'testuser7@testuser7.com', password: '!Q2w3e4r' },
//   { email: 'testuser8@testuser8.com', password: '!Q2w3e4r' },
//   { email: 'testuser9@testuser9.com', password: '!Q2w3e4r' },
//   { email: 'testuser3@testuser3.com', password: '!Q2w3e4r' },
// ]
// const credentials1 = { email: 'testuser1@testuser1.com', password: '!Q2w3e4r' };
// const credentials2 = { email: 'testuser2@testuser2.com', password: '!Q2w3e4r' };
// const credentials3 = { email: 'testuser3@testuser3.com', password: '!Q2w3e4r' };
// const credentials4 = { email: 'testuser4@testuser4.com', password: '!Q2w3e4r' };
// const credentials5 = { email: 'testuser5@testuser5.com', password: '!Q2w3e4r' };
// const credentials6 = { email: 'testuser6@testuser6.com', password: '!Q2w3e4r' };
// const credentials7 = { email: 'testuser7@testuser7.com', password: '!Q2w3e4r' };
// const credentials8 = { email: 'testuser8@testuser8.com', password: '!Q2w3e4r' };
// const credentials9 = { email: 'testuser9@testuser9.com', password: '!Q2w3e4r' };
// const credentials10 = { email: 'testuser10@testuser10.com', password: '!Q2w3e4r' };
// const credentials11 = { email: 'testuser11@testuser11.com', password: '!Q2w3e4r' };
// const credentials12 = { email: 'testuser12@testuser12.com', password: '!Q2w3e4r' };
// const credentials13 = { email: 'testuser13@testuser13.com', password: '!Q2w3e4r' };
// const credentials14 = { email: 'testuser14@testuser14.com', password: '!Q2w3e4r' };
// const credentials15 = { email: 'testuser15@testuser15.com', password: '!Q2w3e4r' };
// const credentials16 = { email: 'testuser16@testuser16.com', password: '!Q2w3e4r' };

async function authenticateUser(usernumber) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const userFile = `tests/e2e/auth/state/user${usernumber}.json`;
    await page.goto('http://localhost:3000');
    await page.fill('input[name="email"]', `testuser${usernumber}@testuser${usernumber}.com`);
    await page.fill('input[type="password"]', process.env.GENERIC_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL(/.*\/dashboard$/); // 

    expect(page.url()).toMatch(/\/dashboard$/);
    //wait for selector of element that has text testuser1
    await page.waitForSelector(`div:has-text("testuser${usernumber}")`);
    await page.context().storageState({ path: userFile });
    //end test
    await page.close();
    return

}

setup('authenticate all test users', async ({page}) => {
  for (let i = 1; i < 17; i++) {
    await authenticateUser(i);
  }
})

// setup('authenticate as user1', async ({ page }) => {
//     // Perform authentication steps. Replace these actions with your own.
//     await page.goto('http://localhost:3000');
//     await page.fill('input[name="email"]', credentials1.email);
//     await page.fill('input[type="password"]', credentials1.password);
//     await page.click('button[type="submit"]');
//     await page.waitForURL(/.*\/dashboard$/); // 

//     expect(page.url()).toMatch(/\/dashboard$/);
//     //wait for selector of element that has text testuser1
//     await page.waitForSelector('div:has-text("testuser1")');
//     await page.context().storageState({ path: user1File });
//   });
  
  // const user2File = 'tests/e2e/auth/state/user2.json';
  
  // setup('authenticate as user2', async ({ page }) => {
  //   await page.goto('http://localhost:3000');
  //   await page.fill('input[name="email"]', credentials2.email);
  //   await page.fill('input[type="password"]', credentials2.password);
  //   await page.click('button[type="submit"]');
  //   await page.waitForURL(/.*\/dashboard$/); // 
  //   await page.context().storageState({ path: user2File });
  // });



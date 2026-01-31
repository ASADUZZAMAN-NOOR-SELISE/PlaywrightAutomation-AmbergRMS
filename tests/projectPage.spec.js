const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../Modules/Home/homePage');
const { ProjectPage } = require('../Modules/Projects/projectPage');

let webContext

test.beforeAll('Homepaeg to dashboard @login @smoke', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  try {
    await loginPage.goto();
    await loginPage.verifyInitialState();
    await loginPage.login();
    await loginPage.logoutVisible();
  } catch (error) {
    await page.screenshot({ path: 'login-failure.png', fullPage: true });
    console.error(' Login test failed:', error.message);
    throw error;
  }

  await context.storageState({path: "state.json"}); // session store at > state.json
  webContext = await browser.newContext({storageState: "state.json"}); // webcontext using that session 
});

test('Create Project @project @smoke', async ({}) => {
 const page = await webContext.newPage(); // create page under the webContext session
 const loginPage = new LoginPage(page);
 const projectPage = new ProjectPage(page);
 
 const projectData = {
   name: 'Automation1',
   number: '123456789',
   startPlace: 'A',
   endPlace: 'B',
   stationingStart: '100',
   stationingEnd: '2000',
   comment: 'General Information',
   lineSection: 'Automation1 line',
   trackName: 'Automation Track 1',
   configTemplate: 'AdifEstNdar1435Mm',
   templateOption: 'ADIF Estándar 1435 - Generales',
 };

 try {
   // Navigate using authenticated session
   await loginPage.goto();
   await loginPage.verifyInitialState();
   
   // Create project
   await projectPage.createProject(projectData);
   console.log('Project created successfully');
 } catch (error) {
   await page.screenshot({ path: 'project-creation-failure.png', fullPage: true });
   console.error('Project creation test failed:', error.message);
   throw error;
 }
});

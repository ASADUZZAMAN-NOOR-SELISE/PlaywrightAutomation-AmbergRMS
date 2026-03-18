const page = await webContext.newPage(); 
const loginPage = new LoginPage(page); 
const common = new Common(page); 
const tree = new ProjectTreePage(page);
const projectName = getUniqueProjectName(); 

 await loginPage.goto(); 
 await common.clickNewProject(); 
 await common.setProjectName(projectName); 
 await common.submitProject(); 
 await common.searchProject(projectName); 
 await expect(page.getByLabel(projectName).first()).toBeVisible(); 
 await common.enterIntoProject(projectName); 
 await expect(page.getByRole('heading', { name: projectName })).toBeVisible(); 
 await tree.addLine("Line section 1"); 
 await tree.submitLineSectionBtn.isVisible(); 
 await tree.submitLineSectionBtn.click(); 
 await expect(page.getByRole('alert').first()).toContainText('Line section created successfully');
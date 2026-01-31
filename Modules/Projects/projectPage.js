const { expect } = require('@playwright/test');
const { projectLocator } = require('../../Utils/Locators/projectLocators');
const { projectAssertions } = require('../../Utils/Assertions/projectAssertions');

class ProjectPage {
  constructor(page) {
    this.page = page;
    this.waitTimeout = 30000;
    this.inputDelay = 100;
  }

  async waitAndGetElement(locatorFunc, description) {
    try {
      const element = locatorFunc();
      await element.waitFor({ state: 'visible', timeout: this.waitTimeout });
      return element;
    } catch (error) {
      console.error(`Failed to find: ${description}`);
      await this.page.screenshot({ path: `error-${description}.png`, fullPage: true });
      throw new Error(`Element not found: ${description}`);
    }
  }

  async safeFill(element, value, description) {
    try {
      await element.waitFor({ state: 'visible', timeout: this.waitTimeout });
      await element.click({ timeout: 5000 });
      await this.page.waitForTimeout(200);
      await element.clear();
      await this.page.waitForTimeout(100);
      await element.fill(value);
      await this.page.waitForTimeout(200);
      
      const filledValue = await element.inputValue();
      if (filledValue !== value) {
        await element.clear();
        await this.page.waitForTimeout(100);
        await element.fill(value);
      }
    } catch (error) {
      console.error(`Failed to fill ${description}:`, error.message);
      throw error;
    }
  }

  async safeType(element, value, description) {
    try {
      await element.waitFor({ state: 'visible', timeout: this.waitTimeout });
      await element.click({ timeout: 5000 });
      await this.page.waitForTimeout(300);
      await element.clear();
      await this.page.waitForTimeout(200);
      await element.pressSequentially(value, { delay: this.inputDelay });
      await this.page.waitForTimeout(300);
    } catch (error) {
      console.error(`Failed to type ${description}:`, error.message);
      throw error;
    }
  }

  async safeClick(element, description) {
    try {
      await element.waitFor({ state: 'visible', timeout: this.waitTimeout });
      await element.click({ timeout: 5000 });
      await this.page.waitForTimeout(300);
    } catch (error) {
      console.error(`Failed to click ${description}:`, error.message);
      throw error;
    }
  }

  async createProject(projectData) {

    try {
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(500);

      const projectHeader = await this.waitAndGetElement(
        () => this.page.getByText(projectLocator.projectHeader.text),
        'Project Header'
      );
      await this.safeClick(projectHeader, 'Project Header');
      await this.page.waitForLoadState('networkidle');

      const newProjectBtn = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.newProjectButton.role, { name: projectLocator.newProjectButton.name }),
        'New Project Button'
      );
      await this.safeClick(newProjectBtn, 'New Project Button');
      await this.page.waitForLoadState('networkidle');

      const nameInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.nameInput.role, { name: projectLocator.nameInput.name }),
        'Name Input'
      );
      await this.safeType(nameInput, projectData.name, 'Project Name');

      const numberInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.numberInput.role, { name: projectLocator.numberInput.name }),
        'Number Input'
      );
      await this.safeFill(numberInput, projectData.number, 'Project Number');

      const startPlaceInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.startPlaceInput.role, { name: projectLocator.startPlaceInput.name }),
        'Start Place Input'
      );
      await this.safeFill(startPlaceInput, projectData.startPlace, 'Start Place');

      const endPlaceInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.endPlaceInput.role, { name: projectLocator.endPlaceInput.name }),
        'End Place Input'
      );
      await this.safeFill(endPlaceInput, projectData.endPlace, 'End Place');

      const stationingStartInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.stationingStartInput.role, { name: projectLocator.stationingStartInput.name }),
        'Stationing Start Input'
      );
      await this.safeFill(stationingStartInput, projectData.stationingStart, 'Stationing Start');

      const stationingEndInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.stationingEndInput.role, { name: projectLocator.stationingEndInput.name }),
        'Stationing End Input'
      );
      await this.safeFill(stationingEndInput, projectData.stationingEnd, 'Stationing End');

      const commentInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.commentInput.role, { name: projectLocator.commentInput.name }),
        'Comment Input'
      );
      await this.safeFill(commentInput, projectData.comment, 'Comment');

      const lineSectionInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.lineSectionInput.role, { name: projectLocator.lineSectionInput.name }),
        'Line Section Input'
      );
      await this.safeFill(lineSectionInput, projectData.lineSection, 'Line Section');

      const trackNameInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.trackNameInput.role, { name: projectLocator.trackNameInput.name }),
        'Track Name Input'
      );
      await this.safeFill(trackNameInput, projectData.trackName, 'Track Name');

      const configTemplate = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.configTemplate.role, { name: projectLocator.configTemplate.name }),
        'Configuration Template'
      );
      await this.safeClick(configTemplate, 'Configuration Template Dropdown');
      
      const templateOption = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.templateOption.role, { name: projectData.configTemplate }),
        'Template Option'
      );
      await this.safeClick(templateOption, `Template Option: ${projectData.configTemplate}`);

      const templateOptionSelect = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.templateOptionSelect.role, { name: projectLocator.templateOptionSelect.name }),
        'Template Option Select'
      );
      await this.safeClick(templateOptionSelect, 'Template Option Dropdown');
      
      const templateOptionValue = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.templateOptionValue.role, { name: projectData.templateOption }),
        'Template Option Value'
      );
      await this.safeClick(templateOptionValue, `Template Option Value: ${projectData.templateOption}`);

      const submitBtn = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.submitButton.role, { name: projectLocator.submitButton.name }),
        'Submit Button'
      );
      await this.safeClick(submitBtn, 'Submit Button');
      await this.page.waitForLoadState('networkidle');
      await this.page.waitForTimeout(1000);

      const searchInput = await this.waitAndGetElement(
        () => this.page.getByRole(projectLocator.searchInput.role, { name: projectLocator.searchInput.name }),
        'Search Input'
      );
      await this.safeFill(searchInput, projectData.name, 'Search Input');
      await this.page.waitForLoadState('networkidle');

      const projectLabel = this.page.getByText(projectData.name).first();
      await expect(projectLabel).toBeVisible();
      
      return true;
      
    } catch (error) {
      console.error('PROJECT CREATION FAILED');
      console.error('Error:', error.message);
      await this.page.screenshot({ path: `project-creation-failure-${Date.now()}.png`, fullPage: true });
      throw error;
    }
  }
}

module.exports = { ProjectPage };

import { expect } from "@playwright/test";
import { data } from "../../../Utils/Data/Information.js";

const projectName = `${data.templateName.en13848}-twist`;

const expectedLimits = [
    { lower: "-8.0", upper: "8.0" },
    { lower: "-9.0", upper: "9.0" },
    { lower: "-10.0", upper: "10.0" },
];

class TwistPage {
    constructor(page) {
        this.page = page;
        this.projectsHeading = page.getByRole("heading", { name: "Projects" });
        this.searchBox = page.getByRole("textbox", {
            name: "Search by Project Name",
        });
        this.projectName = page.getByLabel(projectName);
        this.projectConfig = page.getByText("Project Configuration");
        this.editConfigBtn = page.getByRole("button", {
            name: "Edit Configuration",
        });
        this.submitBtn = page.getByRole("button", {
            name: "Custom Submit Button",
        });
        this.alert = page.getByRole("alert");
        this.settingsButton = page.locator("button[aria-label='Settings']");
        this.twistDropDown = page.getByRole("button", {
            name: "Twist",
        });
        this.addTwistBtn = page.getByRole('button', { name: 'Add Twist Base' })
        this.twistBaseLengthInput = page.locator(
            '[name="Cant.TwistBaseLengths.0"]',
        );
        this.twistBase2Input = page.locator(
            '[name="Cant.TwistBaseLengths.1"]',
        );
        this.twistBaseLengthError = page.getByText("Twist Base 1 is required", {
            exact: true,
        });
        this.twistBase2Error = page.getByText("Twist Base 2 is required", {
            exact: true,
        });
        this.twistBaseLengthRangeError = page.getByText(
            "Please enter Twist Base between 0.1 and 200.00 m",
        );
        this.symmetricLimitsCheckbox = page.getByRole("checkbox", {
            name: "Symmetric Limits",
        });
        this.consisderCurvatureCheckbox = page.getByRole("checkbox", {
            name: "Consider Curvature",
        });
        this.limitTab = page.getByRole("tab", {
            name: "Limit table(s) Twist: Curve",
        });
    }

    async navigateToTwist() {
        await expect(this.projectsHeading).toHaveText("Projects");
        await this.searchBox.click();
        await this.searchBox.fill(projectName);
        await this.projectName.first().click();
        await this.projectConfig.click();
        await this.editConfigBtn.click();
        await this.twistDropDown.click();
    }

    async verifyBaseValue() {
        await this.twistBaseLengthInput.fill("");
        await this.submitBtn.click();
        await expect(this.twistBaseLengthError).toBeVisible();
        await this.twistBaseLengthInput.fill("300");
        await this.submitBtn.click();
        await expect(this.twistBaseLengthError).not.toBeVisible();
        await expect(this.twistBaseLengthRangeError).toBeVisible();
        await this.twistBaseLengthInput.fill("2.00");
        await this.submitBtn.click();
        await expect(this.twistBaseLengthRangeError).not.toBeVisible();
    }

    async addNewTwistBase() {
        await this.editConfigBtn.click();
        await this.addTwistBtn.click();
        await this.twistBase2Input.fill("");
        await this.submitBtn.click();
        await expect(this.twistBase2Error).toBeVisible();
        await this.twistBase2Input.fill("300");
        await this.submitBtn.click();
        await expect(this.twistBase2Error).not.toBeVisible();
        await expect(this.twistBaseLengthRangeError).toBeVisible();
        await this.twistBase2Input.fill("2.00");
        await this.submitBtn.click();
        await expect(this.twistBaseLengthRangeError).not.toBeVisible();
    }
}

export default TwistPage;

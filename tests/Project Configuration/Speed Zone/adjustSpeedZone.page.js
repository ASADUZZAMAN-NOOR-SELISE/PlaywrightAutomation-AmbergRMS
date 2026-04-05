import { expect } from "@playwright/test";
import SpeedZonePage from "./speedZone.page";

class AdjustSpeedZonePage {
  constructor(page) {
    this.page = page;
    this.speedZonesTab = page.getByRole("button", { name: "Speed Zones" });
  }

  getDeleteBtn(n) {
    return this.page.getByRole("button", {
      name: `SpeedZoneDeleteButton${n}`,
    });
  }

  async deleteMiddleSpeedZone() {
    const speedZonePage = new SpeedZonePage(this.page);
    await speedZonePage.navigateToSpeedZone();

    await this.speedZonesTab.click();
    await this.getDeleteBtn(3).click();
  }
}

export default AdjustSpeedZonePage;

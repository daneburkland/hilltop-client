import uuid from "uuid";

export default class RecordingStep {
  constructor({ viewport, location, type, manualType, displayType, target }) {
    this.id = uuid.v1();
    this.viewport = viewport;
    this.location = location;
    this.type = type;
    this.manualType = manualType;
    this.displayType = displayType;
    this.target = target;
  }

  _getClickCode() {
    return `await page.click("${this.target.selector}");`;
  }

  _getKeyDownCode() {
    return `await page.keyboard.press("Enter");`;
  }

  _getChangeCode() {
    // TODO: how do i check if input is text _based_ (vs. file, radio etc.)
    if (this.target.type === "text") {
      return `await page.type("${this.target.selector}", "${this.target.value}");`;
    } else {
      return `await page.evaluate(() => {
        document.querySelector("${this.target.selector}").value = "${this.target.value}";
      });`;
    }
  }

  _getHoverStep() {
    return `await page.hover("${this.target.selector}");`;
  }

  _getGotoCode() {
    return `await page.goto("${this.location}", { waitUntil: 'domcontentloaded' });`;
  }

  _waitForSelector() {
    if (!this.target) return null;
    return `await page.waitForSelector("${this.target.selector}", { timeout: 10000 });`;
  }

  _getScreenshotCode() {
    let code = `stepResults[${`'${this.id}'`}].pageScreenshot = await page.screenshot();\n`;
    if (this.target) {
      code = code.concat(`element = await page.$('${this.target.selector}');
      stepResults[${`'${this.id}'`}].elementScreenshot = await element.screenshot();\n`);
    }
    return code;
  }

  _getStepInit() {
    return `stepResults[${`'${this.id}'`}] = { id: '${this.id}'};`;
  }

  _generateStepInteractionCode() {
    if (this.manualType === "goTo") {
      return this._getGotoCode();
    } else if (this.manualType === "hover") {
      return this._getHoverStep();
    } else if (this.displayType === "click") {
      return this._getClickCode();
    } else if (this.type === "change") {
      return this._getChangeCode();
    } else if (this.type === "keydown") {
      return this._getKeyDownCode();
    }
  }

  _getSetPassing() {
    return `stepResults[${`'${this.id}'`}].isOk = true;`;
  }

  generateCodeForStep() {
    return [
      this._getStepInit(),
      this._waitForSelector(),
      this._getScreenshotCode(),
      this._generateStepInteractionCode(),
      this._getSetPassing()
    ]
      .filter(v => v)
      .join("\n");
  }

  generateDebugCodeForStep() {
    return [this._waitForSelector(), this._generateStepInteractionCode()]
      .filter(v => v)
      .join("\n");
  }
}

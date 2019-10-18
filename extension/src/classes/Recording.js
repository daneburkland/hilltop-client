import { API } from "aws-amplify";
const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

export default class Recording {
  constructor() {
    this.steps = [];
    this.location = null;
    this.code = null;
    this.cookies = null;
  }

  static waitForSelector(selector) {
    return `await page.waitForSelector("${selector}");\n`;
  }

  _addScreenshotStep(index) {
    this.code = this.code.concat(
      `screenshots[${index}] = await page.screenshot();\n`
    );
  }

  _addClickStep(step) {
    this.code = this.code.concat(
      `${Recording.waitForSelector(step.target.selector)}\nawait page.click("${
        step.target.selector
      }");\n`
    );
  }

  _addKeyDownStep(step) {
    this.code = this.code.concat(
      `${Recording.waitForSelector(
        step.target.selector
      )}\nawait page.keyboard.press("Enter");\n`
    );
  }

  _addChangeStep(step) {
    // TODO: how do i check if input is text _based_ (vs. file, radio etc.)
    if (step.target.type === "text") {
      this.code = this.code.concat(
        `${Recording.waitForSelector(step.target.selector)}\nawait page.type("${
          step.target.selector
        }", "${step.target.value}");\n`
      );
    } else {
      this.code = this.code.concat(`${Recording.waitForSelector(
        step.target.selector
      )}\nawait page.evaluate(() => {
        document.querySelector("${step.target.selector}").value = "${
        step.target.value
      }";
      });\n`);
    }
  }

  _addHoverStep(step) {
    this.code = this.code.concat(
      `${Recording.waitForSelector(step.target.selector)}\nawait page.hover("${
        step.target.selector
      }");\n`
    );
  }

  _processClickEvent(event) {
    // ignore click events on text input elements
    if (TEXT_INPUT_TYPES.includes(event.target.type)) {
      return;
    } else this.steps = [...this.steps, event];
  }

  _processKeydownEvent(event) {
    if ([13].includes(event.keyCode)) {
      this.steps = [...this.steps, event];
    } else return;
  }

  _generateViewportStep() {
    this.code = this.code.concat(
      `await page.setViewport({ width: ${this.viewport.width}, height: ${this.viewport.height}});\n`
    );
  }

  _generateGotoStep() {
    this.code = this.code.concat(`await page.goto("${this.location}");\n`);
  }

  _generateSetCookiesStep() {
    this.code = this.code.concat(`await page.setCookie(...context.cookies);\n`);
  }

  _generatePuppeteerCode() {
    this.code = "";
    if (!!this.steps.length) {
      this._generateViewportStep();
    }
    if (!!this.cookies) {
      this._generateSetCookiesStep();
    }
    this._generateGotoStep();
    this.steps.forEach((step, i) => {
      if (step.manualType === "hover") {
        this._addHoverStep(step);
      } else if (step.displayType === "click") {
        this._addClickStep(step);
      } else if (step.type === "change") {
        this._addChangeStep(step);
      } else if (step.type === "keydown") {
        this._addKeyDownStep(step);
      }
      this._addScreenshotStep(i);
    });
  }

  _wrapInTestShell() {
    this.code = `const assert = require('assert');
  
    const screenshots = [];
    module.exports = async ({page, context}) => {
      try {
        ${this.code}
      } catch(e) {
        console.error(e);
        return {
          data: { error: e.message, screenshots },
          type: 'application/json'
        };
      }
      return {
        data: { screenshots },
        type: 'application/json'
      };
    };
    `;
  }

  addEvent(event) {
    if (event.viewport && !this.viewport) {
      this.viewport = event.viewport;
    }
    if (event.location && !this.location) {
      this.location = event.location;
    }
    if (event.type === "click") {
      this._processClickEvent(event);
    }
    if (event.type === "keydown") {
      this._processKeydownEvent(event);
    }
    if (event.type === "change") {
      this.steps = [...this.steps, event];
    }
    if (event.manualType === "hover") {
      this.steps = [...this.steps, event];
    }
    this._generatePuppeteerCode();
    this._wrapInTestShell();
    return this;
  }

  async save() {
    const response = await API.post("notes", "/notes", {
      body: this
    });
    return response;
  }
}

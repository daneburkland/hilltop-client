import { API } from "aws-amplify";
import RecordingStep from "./RecordingStep";
const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

export default class Recording {
  constructor() {
    this.steps = [];
    this.location = null;
    this.code = "";
    this.rawCookies = null;
    this.cookies = null;
    this.captureSession = null;
  }

  static waitForSelector(selector) {
    return `await page.waitForSelector("${selector}", { timeout: 10000 });\n`;
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
    } else this.steps = [...this.steps, new RecordingStep(event)];
  }

  _processKeydownEvent(event) {
    if ([13].includes(event.keyCode)) {
      this.steps = [...this.steps, new RecordingStep(event)];
    } else return;
  }

  _generateViewportStep() {
    this.code = this.code.concat(
      `await page.setViewport({ width: ${this.viewport.width}, height: ${this.viewport.height}});\n`
    );
  }

  _generateGotoStep() {
    this.code = this.code.concat(
      `await page.goto("${this.location}", { waitUntil: 'domcontentloaded' });\n`
    );
  }

  _generateSetCookiesStep() {
    this.code = this.code.concat(`await page.setCookie(...context.cookies);\n`);
  }

  _generateWaitForLoadStep() {
    this.code = this.code.concat(`await Promise.race([
      page.waitForNavigation({waitUntil: 'load'}),
      page.waitForNavigation({waitUntil: 'networkidle0'})
    ]);\n`);
  }

  _generatePuppeteerCode() {
    this.code = "";
    if (!!this.steps.length) {
      this._generateViewportStep();
    }
    this._generateSetCookiesStep();
    this._addScreenshotStep(0);
    this.steps.forEach((step, i) => {
      if (step.manualType === "goTo") {
        this._generateGotoStep();
      } else if (step.manualType === "hover") {
        this._addHoverStep(step);
      } else if (step.displayType === "click") {
        this._addClickStep(step);
      } else if (step.type === "change") {
        this._addChangeStep(step);
      } else if (step.type === "keydown") {
        this._addKeyDownStep(step);
      }
      // this._generateWaitForLoadStep();
      this._addScreenshotStep(parseInt(i + 1));
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

  _normalizeCookies() {
    const parseValue = value =>
      value[value.length - 1] === ";"
        ? value.substring(0, value.length - 1)
        : value;
    const parseCookies = () => {
      return this.rawCookies[0].value.split(" ").map(cookieString => {
        const arr = cookieString.split("=");
        return {
          name: arr[0],
          url: this.location,
          value: parseValue(arr[1])
        };
      });
    };
    this.cookies = this.captureSession ? parseCookies() : [];
  }

  addEvent(event) {
    if (event.viewport && !this.viewport) {
      this.viewport = event.viewport;
    }
    if (event.location && !this.location) {
      this.location = event.location;
      this.steps = [
        new RecordingStep({
          location: event.location,
          manualType: "goTo",
          displayType: "go to"
        }),
        ...this.steps
      ];
    }
    if (event.type === "click") {
      this._processClickEvent(event);
    }
    if (event.type === "keydown") {
      this._processKeydownEvent(event);
    }
    if (event.type === "change") {
      this.steps = [...this.steps, new RecordingStep(event)];
    }
    if (event.manualType === "hover") {
      this.steps = [...this.steps, new RecordingStep(event)];
    }
    this._generatePuppeteerCode();
    this._wrapInTestShell();
    return this;
  }

  addCookies(cookies) {
    this.rawCookies = cookies;
    return this;
  }

  addCaptureSession(captureSession) {
    this.captureSession = captureSession;
    return this;
  }

  async save() {
    this._normalizeCookies();
    const response = await API.post("notes", "/notes", {
      body: this
    });
    return response;
  }
}

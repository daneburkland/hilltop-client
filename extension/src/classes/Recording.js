import { API } from "aws-amplify";
import RecordingStep from "./RecordingStep";
const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

export default class Recording {
  constructor() {
    this.steps = [];
    this.location = null;
    this.code = "";
    this.debugCode = "";
    this.rawCookies = null;
    this.cookies = null;
    this.captureSession = null;
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

  _waitForSelector(target) {
    if (!target) return null;
    return `await page.waitForSelector("${target.selector}", { timeout: 10000 });`;
  }

  _addScreenshotStep(index) {
    return `screenshots[${index}] = await page.screenshot();`;
  }

  _addWaitForSelectorStep(step) {
    return `${Recording.waitForSelector(step.target.selector)}`;
  }

  _addClickStep(step) {
    return `await page.click("${step.target.selector}");`;
  }

  _addKeyDownStep() {
    return `await page.keyboard.press("Enter");`;
  }

  _addChangeStep(step) {
    // TODO: how do i check if input is text _based_ (vs. file, radio etc.)
    if (step.target.type === "text") {
      return `await page.type("${step.target.selector}", "${step.target.value}");`;
    } else {
      return `await page.evaluate(() => {
        document.querySelector("${step.target.selector}").value = "${step.target.value}";
      });`;
    }
  }

  _addHoverStep(step) {
    return `await page.hover("${step.target.selector}");`;
  }

  _generateViewportStep() {
    return `await page.setViewport({ width: ${this.viewport.width}, height: ${this.viewport.height}});`;
  }

  _generateGotoStep() {
    return `await page.goto("${this.location}", { waitUntil: 'domcontentloaded' });`;
  }

  _generateSetCookiesStep() {
    return `await page.setCookie(...context.cookies);`;
  }

  _generateWaitForLoadStep() {
    return `await Promise.race([
      page.waitForNavigation({waitUntil: 'load'}),
      page.waitForNavigation({waitUntil: 'networkidle0'})
    ]);`;
  }

  _generateStepInteractionCode(step) {
    if (step.manualType === "goTo") {
      return this._generateGotoStep();
    } else if (step.manualType === "hover") {
      return this._addHoverStep(step);
    } else if (step.displayType === "click") {
      return this._addClickStep(step);
    } else if (step.type === "change") {
      return this._addChangeStep(step);
    } else if (step.type === "keydown") {
      return this._addKeyDownStep(step);
    }
  }

  _generateCodeForStep(step, i) {
    return [
      this._waitForSelector(step.target),
      this._addScreenshotStep(parseInt(i)),
      this._generateStepInteractionCode(step)
    ]
      .filter(v => v)
      .join("\n");
  }

  _generateDebugCodeForStep(step, i) {
    return [
      this._waitForSelector(step.target),
      this._generateStepInteractionCode(step)
    ]
      .filter(v => v)
      .join("\n");
  }

  _generateCode() {
    const code = [
      !!this.steps.length && this._generateViewportStep(),
      this._generateSetCookiesStep(),
      ...this.steps.map(this._generateCodeForStep.bind(this))
    ]
      .filter(x => x)
      .join("\n");

    this.code = `const assert = require('assert');
  
      const screenshots = [];
      module.exports = async ({page, context}) => {
        try {
          ${code}
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

  _generateDebugCode() {
    const code = [
      !!this.steps.length && this._generateViewportStep(),
      ...this.steps.map(this._generateDebugCodeForStep.bind(this))
    ]
      .filter(v => v)
      .join("\n");

    this.debugCode = `module.exports = async ({ page }) => {
      ${code}
    }`;
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
    this._generateCode();
    this._generateDebugCode();
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

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

  _generateViewportStep() {
    return `await page.setViewport({ width: ${this.viewport.width}, height: ${this.viewport.height}});`;
  }

  _generateGotoStep() {
    return `await page.goto("${this.location}", { waitUntil: 'domcontentloaded' });`;
  }

  _generateSetCookiesStep() {
    return `await page.setCookie(...context.cookies);`;
  }

  _generateCode() {
    const code = [
      !!this.steps.length && this._generateViewportStep(),
      this._generateSetCookiesStep(),
      ...this.steps.map(step => step.generateCodeForStep())
    ]
      .filter(x => x)
      .join("\n");

    this.code = `const assert = require('assert');
  
      
      const stepResults = {};
      let element;
      module.exports = async ({page, context}) => {
        try {
          ${code}
        } catch(e) {
          console.error(e);
          return {
            data: { error: e.message, stepResults },
            type: 'application/json'
          };
        }
        return {
          data: { stepResults },
          type: 'application/json'
        };
      };
      `;
  }

  _generateDebugCode() {
    const code = [
      !!this.steps.length && this._generateViewportStep(),
      ...this.steps.map(step => step.generateDebugCodeForStep())
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

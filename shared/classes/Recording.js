import { API } from "aws-amplify";
import RecordingStep from "./RecordingStep";
import RecordingResult from "./RecordingResult";
import parse from "url-parse";
import prettier from "prettier/standalone";
import babelParser from "prettier/parser-babylon";
const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

const prettify = code =>
  prettier.format(code, { parser: "babel", plugins: [babelParser] });

export default class Recording {
  constructor({
    steps,
    location,
    isAuthFlow,
    code,
    debugCode,
    rawCookies,
    cookies,
    name,
    authFlow,
    results,
    recordingId,
    latestResult,
    nextScheduledTest,
    teamId
  } = {}) {
    this.steps = steps || [];
    this.location = location || null;
    this.isAuthFlow = isAuthFlow || null;
    this.code = code || "";
    this.debugCode = debugCode || "";
    this.rawCookies = rawCookies || null;
    this.cookies = cookies || null;
    this.name = name || "";
    this.authFlow = authFlow || null;
    this.results = results || [];
    this.recordingId = recordingId || null;
    this.latestResult = !!latestResult
      ? new RecordingResult(latestResult)
      : null;
    this.nextScheduledTest = nextScheduledTest || null;
    this.teamId = teamId || null;
  }

  static from(json) {
    return Object.assign(new Recording(), json);
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
    return `await page.goto("${this.location.href}", { waitUntil: 'domcontentloaded' });`;
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

    this.code = prettify(`const assert = require('assert');
  
      
      const stepResults = {};
      let authedCookies = [];
      let element, tracing;
      module.exports = async ({page, context}) => {
        await page.tracing.start();
        try {
          ${code}
          tracing = await page.tracing.stop();
          await page.waitFor(500);
          ${
            !!this.isAuthFlow
              ? `authedCookies = await page.cookies();`
              : `console.log('not an auth flow');`
          }
        } catch(e) {
          tracing = await page.tracing.stop();
          return {
            data: { error: e.message, stepResults, tracing },
            type: 'application/json'
          };
        }
        return {
          data: { stepResults, authedCookies, tracing },
          type: 'application/json'
        };
      };
      `);
  }

  _generateDebugCode() {
    const code = [
      !!this.steps.length && this._generateViewportStep(),
      ...this.steps.map(step => step.generateDebugCodeForStep())
    ]
      .filter(v => v)
      .join("\n");

    this.debugCode = prettify(`module.exports = async ({ page }) => {
      try {
        ${code}
      } catch(e) {
        console.info('Hilltop execution failed:');
        console.error(e)
        return {
          data: { e }
        }
      }
    }`);
  }

  _normalizeCookies() {
    const parseValue = value =>
      value[value.length - 1] === ";"
        ? value.substring(0, value.length - 1)
        : value;
    const parseCookies = () => {
      if (!this.rawCookies) return [];
      return this.rawCookies[0].value.split(" ").map(cookieString => {
        const arr = cookieString.split("=");
        return {
          name: arr[0],
          url: this.location.href,
          value: parseValue(arr[1])
        };
      });
    };
    this.cookies = parseCookies();
  }

  addAuthFlow(authFlow) {
    this.authFlow = authFlow;
    return this;
  }

  addUrl(url) {
    if (!!this.location) return this;
    this.location = parse(url);

    this.name = `${this.location.hostname} - ${new Date().toString()}`;
    this.steps = [
      new RecordingStep({
        location: url,
        type: "goTo"
      }),
      ...this.steps
    ];
    return this;
  }

  updateName(name) {
    this.name = name;
    return this;
  }

  addEvent(event) {
    if (event.viewport && !this.viewport) {
      this.viewport = event.viewport;
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

  deleteStep(stepId) {
    this.steps = this.steps.filter(({ id }) => id !== stepId);
    return this;
  }

  addCookies(cookies) {
    this.rawCookies = cookies;
    return this;
  }

  async save({ isAuthFlow }) {
    this._normalizeCookies();
    this.isAuthFlow = isAuthFlow;
    this._generateCode();
    const response = await API.post("recordings", "/recordings", {
      body: this
    });
    return response;
  }

  static async fetch({ id }) {
    try {
      const recording = await API.get("recordings", `/recordings/${id}`);
      return new Recording(recording);
    } catch (e) {
      console.error("failed to fetch recording");
    }
  }
}

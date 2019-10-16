import finder from "@medv/finder";

const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

function _processClickEvent({ event, steps }) {
  // ignore click events on text input elements
  if (TEXT_INPUT_TYPES.includes(event.target.type)) {
    return steps;
  } else return [...steps, event];
}

function _processKeydownEvent({ event, steps }) {
  if ([13].includes(event.keyCode)) {
    return [...steps, event];
  } else return steps;
}

function _getDisplayType({ type, localName, manualType }) {
  if (manualType) return manualType;
  switch (type) {
    case "change":
      if (["input", "textarea"].includes(localName)) {
        return "type";
      } else return type;
    case "click":
      return "click";
    default:
      return type;
  }
}

function _normalizeAttrs(attributes) {
  let arr = [];
  let i;
  for (i = 0; i < attributes.length; i++) {
    const node = attributes.item(i);
    arr.push({ nodeName: node.nodeName, nodeValue: node.nodeValue });
  }
  return arr;
}

function _waitForSelector(selector) {
  return `await page.waitForSelector("${selector}");`;
}

function _mapClickStepToCode(step) {
  return `${_waitForSelector(step.target.selector)}\nawait page.click("${
    step.target.selector
  }");`;
}

function _mapKeydownStepToCode(step) {
  return `${_waitForSelector(
    step.target.selector
  )}\nawait page.keyboard.press("Enter");`;
}

function _mapChangeStepToCode(step) {
  // TODO: how do i check if input is text _based_ (vs. file, radio etc.)
  if (step.target.type === "text") {
    return `${_waitForSelector(step.target.selector)}\nawait page.type("${
      step.target.selector
    }", "${step.target.value}");`;
  } else {
    return `${_waitForSelector(
      step.target.selector
    )}\nawait page.evaluate(() => {
      document.querySelector("${step.target.selector}").value = "${
      step.target.value
    }";
    });`;
  }
}

function _mapHoverStepToCode(step) {
  return `${_waitForSelector(step.target.selector)}\nawait page.hover("${
    step.target.selector
  }");`;
}

function _generateViewportStep(code, { viewport }) {
  return code.concat(
    `await page.setViewport({ width: ${viewport.width}, height: ${viewport.height}});\n`
  );
}

function _generateGotoStep(code, { location }) {
  return code.concat(`await page.goto("${location}");\n`);
}

function _generateScreenshot(index) {
  return `screenshots[${index}] = await page.screenshot();\n`;
}

function _generateSetCookiesStep(code) {
  return code.concat(`await page.setCookie(...context.cookies);\n`);
}

function _generatePuppeteerCode({ steps, location, viewport, cookies }) {
  let code = "";
  if (!!steps.length) {
    code = _generateViewportStep(code, { viewport });
  }
  if (!!cookies) {
    code = _generateSetCookiesStep(code);
  }
  code = _generateGotoStep(code, { location });
  steps.forEach((step, i) => {
    if (step.manualType === "hover") {
      code = code.concat(`${_mapHoverStepToCode(step)}\n`);
    } else if (step.displayType === "click") {
      code = code.concat(`${_mapClickStepToCode(step)}\n`);
    } else if (step.type === "change") {
      code = code.concat(`${_mapChangeStepToCode(step)}\n`);
    } else if (step.type === "keydown") {
      code = code.concat(`${_mapKeydownStepToCode(step)}\n`);
    }
    code = code.concat(_generateScreenshot(i));
  });
  return code;
}

// TODO: that JSON.stringify is causing circular issues
function _wrapInTestShell({ code }) {
  return `const assert = require('assert');

  const screenshots = [];
  module.exports = async ({page, context}) => {
    try {
      ${code}
    } catch(e) {
      console.error(e);
      return {
        data: { error: JSON.stringify(e), screenshots },
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

function updateSteps({ event, steps, viewport, location, cookies }) {
  let updatedSteps = [];
  if (event.type === "click") {
    updatedSteps = _processClickEvent({ event, steps });
  }
  if (event.type === "keydown") {
    updatedSteps = _processKeydownEvent({ event, steps });
  }
  if (event.type === "change") {
    updatedSteps = [...steps, event];
  }
  if (event.manualType === "hover") {
    updatedSteps = [...steps, event];
  }
  const puppeteerCode = _generatePuppeteerCode({
    steps: updatedSteps,
    viewport,
    location,
    cookies
  });
  const code = _wrapInTestShell({ code: puppeteerCode });
  return { steps: updatedSteps, puppeteerCode, code };
}

function parseEvent(event, { manualType } = {}) {
  console.log("Raw event:", event);
  const {
    type,
    keyCode,
    view,
    target: {
      nodeName,
      value,
      innerText,
      baseURI,
      localName,
      firstChild,
      attributes,
      type: targetType
    }
  } = event;

  const optimizedMinLength = event.target.id ? 2 : 10; // if the target has an id, use that instead of multiple other selectors
  const selector = finder(event.target, {
    seedMinLength: 5,
    optimizedMinLength
  });

  const normalizedAttrs = _normalizeAttrs(attributes);
  const obj = {};
  obj.type = type;
  obj.manualType = manualType;
  obj.keyCode = keyCode;
  obj.displayType = _getDisplayType({ type, manualType, localName });
  obj.location = view && view.location.href;
  obj.viewport = view && { height: view.innerHeight, width: view.innerWidth };
  obj.target = {
    nodeName,
    localName,
    value,
    baseURI,
    normalizedAttrs,
    selector,
    innerText,
    type: targetType,
    firstChildNodeName: firstChild && firstChild.nodeName
  };
  return obj;
}

export default {
  parseEvent,
  updateSteps
};

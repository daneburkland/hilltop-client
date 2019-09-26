import finder from "@medv/finder";

const TEXT_INPUT_TYPES = ["email", "password", "search", "tel", "text", "url"];

const processClickEvent = ({ event, steps }) => {
  // ignore click events on text input elements
  if (TEXT_INPUT_TYPES.includes(event.target.type)) {
    return steps;
  } else return [...steps, event];
};

// TODO: checkboxes don't seem to be working
export const updateSteps = ({ event, steps }) => {
  if (event.type === "click") {
    return processClickEvent({ event, steps });
  }
  if (event.type === "change") {
    return [...steps, event];
  }
  return steps;
};

function normalizeType({ type, localName }) {
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

function normalizeAttrs(attributes) {
  let arr = [];
  let i;
  for (i = 0; i < attributes.length; i++) {
    const node = attributes.item(i);
    arr.push({ nodeName: node.nodeName, nodeValue: node.nodeValue });
  }
  return arr;
}

export const parseEvent = event => {
  console.log("Raw Event:", event);
  const {
    type,
    target: {
      nodeName,
      value,
      innerText,
      localName,
      firstChild,
      attributes,
      type: targetType
    }
  } = event;

  const normalizedAttrs = normalizeAttrs(attributes);
  const obj = {};
  obj.type = type;
  obj.normalType = normalizeType({ type, localName });
  obj.target = {
    nodeName,
    localName,
    value,
    normalizedAttrs,
    selector: finder(event.target),
    innerText,
    type: targetType,
    firstChildNodeName: firstChild && firstChild.nodeName
  };
  return obj;
};

function waitForSelector(selector) {
  return `await page.waitForSelector("${selector}");`;
}

function mapClickStepToCode(step) {
  return `${waitForSelector(step.target.selector)}\nawait page.click("${
    step.target.selector
  }");`;
}

function mapChangeStepToCode(step) {
  // TODO: how do i check if input is text _based_ (vs. file, radio etc.)
  if (step.target.type === "text") {
    return `${waitForSelector(step.target.selector)}\nawait page.type("${
      step.target.selector
    }", "${step.target.value}");`;
  } else {
    return `${waitForSelector(
      step.target.selector
    )}\nawait page.evaluate(() => {
      document.querySelector("${step.target.selector}").value = "${
      step.target.value
    }";
    });`;
  }
}

export function generatePuppeteerCode({ steps, location, confirmedHeaders }) {
  let code = `await page.goto("${location.href}");\n`;
  steps.forEach(step => {
    if (step.normalType === "click") {
      code = code.concat(`${mapClickStepToCode(step)}\n`);
    } else if (step.type === "change") {
      code = code.concat(`${mapChangeStepToCode(step)}\n`);
    }
  });
  return code;
}

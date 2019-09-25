const processClickEvent = ({ event, steps }) => {
  return [...steps, event];
  // ignore click events on input elements
  if (
    ["OPTION", "SELECT", "INPUT", "TEXTAREA"].includes(event.target.nodeName)
  ) {
    return steps;
  } else return [...steps, event];
};

// TODO: checkboxes don't seem to be working
export const updateSteps = ({ event, steps }) => {
  if (event.type === "mousedown") {
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
    case "mousedown":
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
    target: { nodeName, value, innerText, localName, firstChild, attributes }
  } = event;

  const obj = {};
  obj.type = type;
  obj.normalType = normalizeType({ type, localName });
  obj.target = {
    nodeName,
    localName,
    value,
    normalizedAttrs: normalizeAttrs(attributes),
    innerText,
    firstChildNodeName: firstChild && firstChild.nodeName
  };
  return obj;
};

// TODO: this needs to be a lot more precise
function getSelectorFromStep({ target: { normalizedAttrs, localName } }) {
  let selector = `${localName}`;

  normalizedAttrs.forEach(attr => {
    selector = selector.concat(`[${attr.nodeName}='${attr.nodeValue}']`);
  });

  return `"${selector}"`;
}

function mapClickStepToCode(step) {
  const selector = getSelectorFromStep(step);
  return `await page.click(${selector});`;
}

export function generatePuppeteerCode({ steps, location, confirmedHeaders }) {
  let code = `await page.goto("${location.href}");\n`;
  steps.forEach(step => {
    if (step.normalType === "click") {
      code = code.concat(`${mapClickStepToCode(step)}\n`);
    }
    // TODO: implement change
  });
  return code;
}

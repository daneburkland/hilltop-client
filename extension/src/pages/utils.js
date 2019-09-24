const processClickEvent = ({ event, steps }) => {
  // ignore click events on input elements
  if (
    ["OPTION", "SELECT", "INPUT", "TEXTAREA"].includes(event.target.nodeName)
  ) {
    return steps;
  } else return [...steps, event];
};

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
    default:
      return type;
  }
}

export const parseEvent = event => {
  const {
    type,
    target: { id, className, nodeName, value, innerText, localName, firstChild }
  } = event;

  const obj = {};
  obj.type = type;
  obj.normalType = normalizeType({ type, localName });
  obj.target = {
    id,
    className,
    nodeName,
    localName,
    value,
    innerText,
    firstChildNodeName: firstChild && firstChild.nodeName
  };
  return obj;
};

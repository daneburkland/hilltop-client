class Target {
  constructor(className, id, nodeName, innerText, value) {
    this.className = className;
    this.id = id;
    this.nodeName = nodeName;
    this.innerText = innerText;
    this.value = value;
  }
}

class Step {
  constructor(action, target, value) {
    // type or click
    this.action = action;
    this.target = target;
    this.value = value;
  }
}

const isSameTarget = (target1, target2) => {
  if (target1.id && target1.id === target2.id) return true;
  if (target1.className && target1.className === target2.className) return true;
  return false;
};

export const updateSteps = ({ event, steps }) => {
  console.log("updating steps:", event.type, event.target.nodeName);
  const lastStep = steps[steps.length - 1];
  if (!lastStep) return [event];
  if (event.type === "click") {
    return [...steps, event];
  }
  if (event.type === "keyup" && event.target.nodeName === "INPUT") {
    if (lastStep.type === "keyup") {
      console.log("replacing last step");
      const newSteps = [...steps];
      newSteps[newSteps.length - 1] = event;
      return newSteps;
    } else if (isSameTarget(lastStep.target, event.target)) {
      console.log("replacing last step");
      const newSteps = [...steps];
      newSteps[newSteps.length - 1] = event;
      return newSteps;
    } else {
      console.log("adding new type step");
      return [...steps, event];
    }
  }
  return steps;
};

function normalizeType(type) {
  switch (type) {
    case "keyup":
      return "type";
    default:
      return type;
  }
}

export const parseEvent = event => {
  const {
    type,
    target: { id, className, nodeName, value, innerText }
  } = event;

  const obj = {};
  obj.type = type;
  obj.normalType = normalizeType(type);
  obj.target = {
    id,
    className,
    nodeName,
    value,
    innerText
  };
  return obj;
};

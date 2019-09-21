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

export const updateSteps = ({ event, steps }) => {
  const lastStep = steps[steps.length - 1];
  // IMPLEMENT THIS
  return null;
};

export const parseEvent = event => {
  const {
    type,
    target: { id, className, nodeName, value }
  } = event;

  const obj = {};
  obj.type = type;
  obj.target = {
    id,
    className,
    nodeName,
    value
  };
  return obj;
};

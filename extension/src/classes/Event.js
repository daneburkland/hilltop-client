import finder from "@medv/finder";

function _normalizeAttrs(attributes) {
  let arr = [];
  let i;
  for (i = 0; i < attributes.length; i++) {
    const node = attributes.item(i);
    arr.push({ nodeName: node.nodeName, nodeValue: node.nodeValue });
  }
  return arr;
}

export default class Event {
  constructor(
    {
      type,
      keyCode,
      view,
      target,
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
    },
    { manualType } = {}
  ) {
    console.log("Raw event:", type, target.type, target);

    const optimizedMinLength = target.id ? 2 : 10; // if the target has an id, use that instead of multiple other selectors
    const selector = finder(target, {
      seedMinLength: 5,
      optimizedMinLength
    });

    const normalizedAttrs = _normalizeAttrs(attributes);
    this.type = manualType || type;
    this.keyCode = keyCode;
    this.location = view && view.location.href;
    this.viewport = view && {
      height: view.innerHeight,
      width: view.innerWidth
    };
    this.target = {
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
  }
}

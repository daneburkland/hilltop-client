import React from "react";
import { ListGroup, Button, Alert } from "react-bootstrap";

function IdOrClassSelector({ normalizedAttrs }) {
  const idAttr = normalizedAttrs.find(attr => attr.nodeName === "id");
  const classAttr = normalizedAttrs.find(attr => attr.nodeName === "class");
  return <span>{!!idAttr ? `#${idAttr.nodeValue}` : classAttr.nodeValue}</span>;
}

function InputTargetMeta({ step: { target, displayType } }) {
  return (
    <>
      <span>{`${displayType} on `}</span>
      <code>{`${target.localName} `}</code>"
      <span className="font-italic">{target.value}"</span>
    </>
  );
}

function KeydownTargetMeta() {
  return (
    <>
      <span>Pressed enter</span>
    </>
  );
}

function ClickTargetMeta({ step: { target, displayType } }) {
  return (
    <>
      <span>{`${displayType} on `}</span>
      <code>{`${target.localName} `}</code>
      {target.firstChildNodeName === "#text" ? (
        <span>{`"${target.innerText}"`}</span>
      ) : (
        <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
      )}
    </>
  );
}

function ChangeTargetMeta({ step: { target, displayType } }) {
  return (
    <>
      <span>{`${displayType} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </>
  );
}

function HoverTargetMeta({ step: { target, displayType } }) {
  return (
    <>
      <span>{`${displayType} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </>
  );
}

function TargetMeta({ step, step: { displayType } }) {
  switch (displayType) {
    case "hover":
      return <HoverTargetMeta step={step} />;
    case "type":
      return <InputTargetMeta step={step} />;
    case "click":
      return <ClickTargetMeta step={step} />;
    case "change":
      return <ChangeTargetMeta step={step} />;
    case "keydown":
      return <KeydownTargetMeta />;
    default:
      return null;
  }
}

// TODO: move this into /shared
export default function Step({ step }) {
  return (
    <ListGroup.Item className="text-truncate">
      <TargetMeta step={step} />
    </ListGroup.Item>
  );
}

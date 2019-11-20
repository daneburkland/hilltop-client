import React from "react";
import { ListGroup } from "react-bootstrap";
import Octicon, { X } from "@primer/octicons-react";

function IdOrClassSelector({ normalizedAttrs }) {
  const idAttr = normalizedAttrs.find(attr => attr.nodeName === "id");
  const classAttr = normalizedAttrs.find(attr => attr.nodeName === "class");
  return (
    <span style={{ whiteSpace: "normal" }}>
      {!!idAttr ? `#${idAttr.nodeValue}` : classAttr && classAttr.nodeValue}
    </span>
  );
}

function InputTargetMeta({ step: { target, type } }) {
  return (
    <div className="text-truncate">
      <span>{`${type} on `}</span>
      <code>{`${target.localName} `}</code>"
      <span className="font-italic">{target.value}"</span>
    </div>
  );
}

function KeydownTargetMeta() {
  return (
    <div>
      <span>Pressed enter</span>
    </div>
  );
}

function ClickTargetMeta({ step: { target, type } }) {
  return (
    <div className="text-truncate">
      <span>{`click on `}</span>
      <code>{`${target.localName} `}</code>
      {target.firstChildNodeName === "#text" ? (
        <span style={{ whiteSpace: "normal" }}>{`"${target.innerText}"`}</span>
      ) : (
        <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
      )}
    </div>
  );
}

function ChangeTargetMeta({ step: { target, type } }) {
  return (
    <div className="text-truncate">
      <span>{`${type} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
      <span>{` to `}</span>
      <span className="font-italic">"{target.value}"</span>
    </div>
  );
}

function HoverTargetMeta({ step: { target, type } }) {
  return (
    <div className="text-truncate">
      <span>{`${type} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </div>
  );
}

function GoToTargetMeta({ step: { location, type } }) {
  return (
    <div className="text-truncate">
      <span>{`${type} `}</span>
      <code>{location}</code>
    </div>
  );
}

export function TargetMeta({ step, step: { type } }) {
  switch (type) {
    case "goTo":
      return <GoToTargetMeta step={step} />;
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

export default function Step({ step, onDeleteStep }) {
  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <TargetMeta step={step} />
      {!!onDeleteStep && step.isDeleteable && (
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => onDeleteStep(step.id)}
        >
          <Octicon icon={X} />
        </button>
      )}
    </ListGroup.Item>
  );
}

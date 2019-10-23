import { Storage } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";

function IdOrClassSelector({ normalizedAttrs }) {
  const idAttr = normalizedAttrs.find(attr => attr.nodeName === "id");
  const classAttr = normalizedAttrs.find(attr => attr.nodeName === "class");
  return (
    <span style={{ whiteSpace: "normal" }}>
      {!!idAttr ? `#${idAttr.nodeValue}` : classAttr.nodeValue}
    </span>
  );
}

function InputTargetMeta({ step: { target, displayType } }) {
  return (
    <div>
      <span>{`${displayType} on `}</span>
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

function ClickTargetMeta({ step: { target, displayType } }) {
  return (
    <div>
      <span>{`${displayType} on `}</span>
      <code>{`${target.localName} `}</code>
      {target.firstChildNodeName === "#text" ? (
        <span style={{ whiteSpace: "normal" }}>{`"${target.innerText}"`}</span>
      ) : (
        <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
      )}
    </div>
  );
}

function ChangeTargetMeta({ step: { target, displayType } }) {
  return (
    <div>
      <span>{`${displayType} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </div>
  );
}

function HoverTargetMeta({ step: { target, displayType } }) {
  return (
    <div>
      <span>{`${displayType} `}</span>
      <code>{`${target.localName} `}</code>
      <IdOrClassSelector normalizedAttrs={target.normalizedAttrs} />
    </div>
  );
}

function GoToTargetMeta({ step: { location, displayType } }) {
  return (
    <div>
      <span>{`${displayType} `}</span>
      <code>{location}</code>
    </div>
  );
}

function TargetMeta({ step, step: { displayType } }) {
  console.log(step, step.displayType);
  switch (displayType) {
    case "go to":
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

function Screenshot({ screenshot: { key } }) {
  const [screenshotSrc, setScreenshotSrc] = useState(null);
  useEffect(() => {
    async function fetchScreenshot() {
      try {
        const result = await Storage.get(key);

        setScreenshotSrc(result);
      } catch (e) {
        console.log(e);
      }
    }
    fetchScreenshot();
  }, []);
  return (
    <img
      className="pl-3"
      style={{ width: 200, height: "auto" }}
      alt=""
      src={screenshotSrc}
    />
  );
}

export default function Step({ step, screenshot }) {
  return (
    <ListGroup.Item className="text-truncate d-flex justify-content-between align-items-center">
      <TargetMeta step={step} />
      {!!screenshot && <Screenshot screenshot={screenshot} />}
    </ListGroup.Item>
  );
}

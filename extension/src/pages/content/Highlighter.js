import { connect } from "react-redux";
import { useEffect } from "react";
import { addEvent } from "../background/actions";
import EventRecorder from "../EventRecorder";

const HOVERED_CLASSNAME = "is-hilltopTargeted";

// Need to parse events in the content script b/c browser events can't be sent
// across chrome extension protocol(?)
function Highlighter({ isRecording, isAddingHoverStep, handleAddEvent }) {
  const shouldHighlight = isRecording && isAddingHoverStep;
  let prevElement = null;

  function handleHighlightHovered({ srcElement }) {
    if (prevElement != null) {
      prevElement.classList.remove(HOVERED_CLASSNAME);
    }

    srcElement.classList.add(HOVERED_CLASSNAME);

    prevElement = srcElement;
  }

  function handleClick(e) {
    e.srcElement.classList.remove(HOVERED_CLASSNAME);
    e.preventDefault();
    e.stopPropagation();
    handleAddEvent(EventRecorder.parseEvent(e, { manualType: "hover" }));
  }

  useEffect(() => {
    if (shouldHighlight) {
      window.addEventListener("mousemove", handleHighlightHovered);
    } else {
      window.removeEventListener("mousemove", handleHighlightHovered);
    }
    return () => {
      window.removeEventListener("mousemove", handleHighlightHovered);
    };
  }, [shouldHighlight]);

  useEffect(() => {
    if (shouldHighlight) {
      window.addEventListener("click", handleClick);
    } else {
      window.removeEventListener("click", handleClick);
    }
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [shouldHighlight]);

  return null;
}

const mapStateToProps = ({ dashboard }) => ({
  isRecording: dashboard.isRecording,
  isAddingHoverStep: dashboard.isAddingHoverStep
});

const mapDispatchToProps = dispatch => ({
  handleAddEvent: e => dispatch(addEvent(e))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Highlighter);

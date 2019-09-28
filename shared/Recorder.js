import { useEffect } from "react";

function useClickListener({ condition, onClick, clickCondition }) {
  return useEffect(() => {
    if (condition) {
      window.addEventListener("click", onClick);
    } else {
      window.removeEventListener("click", onClick);
    }
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [condition, clickCondition]);
}

function useChangeListener({ condition, onChange }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("change", onChange);
    } else {
      window.removeEventListener("change", onChange);
    }
    return () => {
      window.removeEventListener("change", onChange);
    };
  }, [condition]);
}

function useKeypressListener({ condition, onKeypress }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("keypress", onKeypress);
    } else {
      window.removeEventListener("keypress", onKeypress);
    }
    return () => {
      window.removeEventListener("keypress", onKeypress);
    };
  }, [condition]);
}

function useKeydownListener({ condition, onKeydown }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("keydown", onKeydown);
    } else {
      window.removeEventListener("keydown", onKeydown);
    }
    return () => {
      window.removeEventListener("keydown", onKeydown);
    };
  }, [condition]);
}

function Recorder({
  onClick,
  clickCondition,
  onChange,
  onKeypress,
  onKeydown,
  condition
}) {
  useChangeListener({ condition, onChange });
  useClickListener({ condition, onClick, clickCondition });
  useKeypressListener({ condition, onKeypress });
  useKeydownListener({ condition, onKeydown });

  return null;
}

export default Recorder;

import { useEffect } from "react";

function useClickListener({ condition, onClick }) {
  return useEffect(() => {
    if (condition) {
      window.addEventListener("click", onClick);
    } else {
      window.removeEventListener("click", onClick);
    }
    return () => {
      window.removeEventListener("click", onClick);
    };
  }, [condition]);
}

function useKeyPressListener({ condition, onKeyPress }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("keypress", onKeyPress);
    } else {
      window.removeEventListener("keypress", onKeyPress);
    }
    return () => {
      window.removeEventListener("keypress", onKeyPress);
    };
  }, [condition]);
}

function Recorder({ onClick, onKeyPress, condition }) {
  useClickListener({ condition, onClick });
  useKeyPressListener({ condition, onKeyPress });

  return null;
}

export default Recorder;

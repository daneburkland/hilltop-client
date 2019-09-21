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

function useKeyUpListener({ condition, onKeyUp }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("keyup", onKeyUp);
    } else {
      window.removeEventListener("keyup", onKeyUp);
    }
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [condition]);
}

function useFocusListener({ condition, onFocus }) {
  useEffect(() => {
    if (condition) {
      window.addEventListener("focusin", onFocus);
    } else {
      window.removeEventListener("focusin", onFocus);
    }
    return () => {
      window.removeEventListener("focusin", onFocus);
    };
  }, [condition]);
}

function Recorder({ onClick, onKeyUp, onFocus, condition }) {
  useClickListener({ condition, onClick });
  useKeyUpListener({ condition, onKeyUp });
  useFocusListener({ condition, onFocus });

  return null;
}

export default Recorder;

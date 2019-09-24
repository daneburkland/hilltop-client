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

function Recorder({ onClick, onChange, condition }) {
  useClickListener({ condition, onClick });
  useChangeListener({ condition, onChange });

  return null;
}

export default Recorder;

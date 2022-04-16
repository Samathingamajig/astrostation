import "./Modal.scss";
import { useEffect } from "react";
import { TimerSettings } from "../Timer/Settings";

export const Modal = ({ isVisible = false, onClose }) => {
  const keydownHandler = ({ key }) => {
    switch (key) {
      case "Escape":
        onClose();
        break;
      default:
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", keydownHandler);
    return () => document.removeEventListener("keydown", keydownHandler);
  });

  return !isVisible ? null : (
    <div className="modal" onClick={onClose}>
      <div className="" onClick={(e) => e.stopPropagation()}>
        <TimerSettings />
      </div>
    </div>
  );
};
